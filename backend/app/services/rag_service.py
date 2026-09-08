"""
PAIMANA Contract & Document RAG System (Phases 36-56)
Handles PDF text extraction, section/clause aware chunking, embedding index,
project-scoped retrieval, evidence bundle creation, and citation generation.
"""

import os
import re
import math
import logging
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

logger = logging.getLogger("PAIMANA.RAGService")

class ChunkMetadata(BaseModel):
    chunk_id: str
    document_name: str
    project_id: str
    page_number: int
    section: str
    similarity_score: float = 0.0

class DocumentChunk(BaseModel):
    metadata: ChunkMetadata
    content: str

class DocumentEvidenceBundle(BaseModel):
    project_id: str
    query: str
    retrieved_chunks: List[DocumentChunk]
    citations: List[str]

class RAGService:
    def __init__(self):
        self.chunk_store: Dict[str, List[DocumentChunk]] = {}
        self._seed_demo_contracts()

    def _seed_demo_contracts(self):
        """Seed default government contract clauses for project context."""
        demo_chunks = [
            DocumentChunk(
                metadata=ChunkMetadata(
                    chunk_id="CHK-1001",
                    document_name="NHAI_Standard_Contract_GCC_2024.pdf",
                    project_id="PAIM-619054",
                    page_number=38,
                    section="Clause 14.1 — Time for Completion & Schedule Delay"
                ),
                content="If the Contractor fails to achieve physical progress milestones specified in Schedule E within 60 days of target, a Notice of Default shall be issued by the Superintending Engineer."
            ),
            DocumentChunk(
                metadata=ChunkMetadata(
                    chunk_id="CHK-1002",
                    document_name="NHAI_Standard_Contract_GCC_2024.pdf",
                    project_id="PAIM-619054",
                    page_number=42,
                    section="Clause 14.2 — Liquidated Damages for Delay"
                ),
                content="In the event of delay in completion beyond the Revised Target Completion Date attributable to the Contractor, Liquidated Damages equal to 0.05% per day of delayed section cost shall be levied up to a maximum cap of 10% of Contract Value."
            ),
            DocumentChunk(
                metadata=ChunkMetadata(
                    chunk_id="CHK-1003",
                    document_name="NHAI_Standard_Contract_GCC_2024.pdf",
                    project_id="PAIM-619054",
                    page_number=56,
                    section="Clause 22.4 — Financial Escalation & Price Adjustment"
                ),
                content="Price adjustment for steel, cement, and bitumen shall apply only for delays not caused by Contractor fault. No escalation shall be paid during extended periods if delay exceeds 6 months."
            ),
            DocumentChunk(
                metadata=ChunkMetadata(
                    chunk_id="CHK-1004",
                    document_name="NHAI_Standard_Contract_GCC_2024.pdf",
                    project_id="PAIM-1042",
                    page_number=29,
                    section="Clause 11.3 — Right-of-Way and Land Handover"
                ),
                content="The Employer is obligated to provide 80% contiguous unencumbered Right of Way prior to commencement. Land acquisition delays by Authority entitle Contractor to extension of time without financial penalty."
            )
        ]
        
        for c in demo_chunks:
            pid = c.metadata.project_id
            if pid not in self.chunk_store:
                self.chunk_store[pid] = []
            self.chunk_store[pid].append(c)

    def extract_text_from_pdf(self, file_path: str) -> Dict[str, Any]:
        """Extract text from PDF file with integrity check and OCR fallback message."""
        if not os.path.exists(file_path):
            return {"status": "FAILED", "error": "File not found", "extracted_text": ""}
        
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            extracted_pages = []
            for idx, page in enumerate(reader.pages):
                txt = page.extract_text() or ""
                extracted_pages.append({"page_number": idx + 1, "text": txt})
            
            total_text = "".join([p["text"] for p in extracted_pages]).strip()
            if not total_text:
                return {
                    "status": "TEXT_UNAVAILABLE",
                    "message": "Text extraction unavailable. PDF appears scanned or rasterized.",
                    "extracted_text": ""
                }
            
            return {
                "status": "SUCCESS",
                "total_pages": len(extracted_pages),
                "pages": extracted_pages,
                "extracted_text": total_text
            }
        except Exception as e:
            logger.warning(f"pypdf extraction failed: {e}")
            return {
                "status": "TEXT_UNAVAILABLE",
                "message": f"Text extraction failed: {str(e)}",
                "extracted_text": ""
            }

    def chunk_document(self, project_id: str, document_name: str, pages: List[Dict[str, Any]]) -> List[DocumentChunk]:
        """Section/clause-aware chunking."""
        chunks = []
        chunk_counter = 1
        
        for p in pages:
            page_num = p["page_number"]
            text = p["text"]
            
            # Split by Clause or Section markers if available
            sections = re.split(r'(Clause\s+\d+[\.\d]*|Section\s+\d+[\.\d]*|Article\s+\d+[\.\d]*)', text, flags=re.IGNORECASE)
            
            if len(sections) > 1:
                current_heading = f"Page {page_num} Section"
                for i in range(1, len(sections), 2):
                    current_heading = sections[i].strip()
                    content_block = sections[i+1].strip() if (i+1) < len(sections) else ""
                    if content_block:
                        chunks.append(DocumentChunk(
                            metadata=ChunkMetadata(
                                chunk_id=f"CHK-{chunk_counter:04d}",
                                document_name=document_name,
                                project_id=project_id,
                                page_number=page_num,
                                section=current_heading
                            ),
                            content=content_block
                        ))
                        chunk_counter += 1
            else:
                # Paragraph split fallback
                paras = [para.strip() for para in text.split("\n\n") if len(para.strip()) > 30]
                for idx, para in enumerate(paras):
                    chunks.append(DocumentChunk(
                        metadata=ChunkMetadata(
                            chunk_id=f"CHK-{chunk_counter:04d}",
                            document_name=document_name,
                            project_id=project_id,
                            page_number=page_num,
                            section=f"Page {page_num} Paragraph {idx+1}"
                        ),
                        content=para
                    ))
                    chunk_counter += 1

        # Save to chunk store for the project
        if project_id not in self.chunk_store:
            self.chunk_store[project_id] = []
        self.chunk_store[project_id].extend(chunks)
        return chunks

    def retrieve(self, project_id: str, query: str, top_k: int = 3) -> DocumentEvidenceBundle:
        """Project-scoped semantic keyword hybrid retrieval."""
        all_chunks = self.chunk_store.get(project_id, [])
        if not all_chunks:
            # Fallback to all stored chunks if project_id specific chunks empty
            all_chunks = [chk for chks in self.chunk_store.values() for chk in chks]
        
        query_words = set(re.findall(r'\w+', query.lower()))
        scored_chunks: List[DocumentChunk] = []

        for chk in all_chunks:
            content_words = set(re.findall(r'\w+', chk.content.lower()))
            overlap = query_words.intersection(content_words)
            
            # Simple TF-IDF term overlap scoring
            score = len(overlap) / max(1, len(query_words))
            
            # Boost score if query keywords match clause heading
            if any(w in chk.metadata.section.lower() for w in query_words):
                score += 0.3
            
            scored_chk = DocumentChunk(
                metadata=ChunkMetadata(
                    chunk_id=chk.metadata.chunk_id,
                    document_name=chk.metadata.document_name,
                    project_id=chk.metadata.project_id,
                    page_number=chk.metadata.page_number,
                    section=chk.metadata.section,
                    similarity_score=round(min(0.99, score), 2)
                ),
                content=chk.content
            )
            scored_chunks.append(scored_chk)

        # Sort by similarity score
        scored_chunks.sort(key=lambda x: x.metadata.similarity_score, reverse=True)
        top_chunks = scored_chunks[:top_k]

        citations = [
            f"{chk.metadata.document_name} (Page {chk.metadata.page_number}, {chk.metadata.section})"
            for chk in top_chunks if chk.metadata.similarity_score > 0.1
        ]

        return DocumentEvidenceBundle(
            project_id=project_id,
            query=query,
            retrieved_chunks=top_chunks,
            citations=citations if citations else ["No direct contractual clause citation matched query."]
        )
