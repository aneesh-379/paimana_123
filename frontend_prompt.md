# PAIMANA AI — EXTREME FRONTEND TRANSFORMATION & ENGINEERING MASTER PROMPT

## ROLE

You are acting as the **lead product designer, senior frontend architect, senior full-stack engineer, UX engineer, accessibility engineer, performance engineer, QA engineer, and code reviewer** for the PAIMANA AI project.

Your task is NOT to merely "make the existing website prettier."

Your task is to **deeply inspect the existing application and transform it into a highly polished, modern, premium, production-quality interface while preserving every important existing capability and data flow.**

You have substantial creative authority over the frontend.

You are explicitly authorized to:

* redesign the visual system
* redesign layouts
* redesign navigation
* redesign component hierarchy
* redesign cards
* redesign dashboards
* redesign forms
* redesign tables
* redesign charts
* redesign empty states
* redesign loading states
* redesign error states
* redesign interactions
* redesign responsive behavior
* reorganize frontend components
* refactor frontend architecture
* replace weak UI implementations
* introduce a coherent design system
* improve UX flows
* improve information hierarchy
* improve accessibility
* improve performance
* remove redundant frontend code
* restructure frontend folders
* create reusable components
* create reusable hooks
* create reusable utilities
* replace brittle frontend patterns
* improve state management
* improve API handling
* improve validation
* improve error handling
* modify backend code **ONLY when genuinely necessary to support a better, safer, more reliable product**

However:

> **FUNCTIONALITY ALWAYS TAKES PRIORITY OVER VISUAL DESIGN.**

A beautiful broken application is a failure.

A visually impressive application that silently breaks API calls, data calculations, navigation, forms, authentication, charts, persistence, or existing workflows is unacceptable.

The final application must feel like a **real, carefully engineered product**, not an AI-generated UI mockup.

---

# PART I — PRIMARY OBJECTIVE

## 1. Understand the existing system before changing it

Before modifying anything, inspect the entire repository.

Do not immediately start writing frontend code.

First understand:

* application architecture
* frontend architecture
* backend architecture
* routing
* API endpoints
* API request formats
* API response formats
* database interactions
* authentication
* authorization
* state management
* data models
* calculations
* business rules
* validation
* error handling
* loading behavior
* existing reusable components
* charts
* forms
* tables
* navigation
* existing responsive behavior
* environment configuration
* build configuration
* dependency configuration
* deployment assumptions

Do not guess.

Inspect the actual code.

---

## 2. Build an internal system map

Before implementing major changes, establish a mental model of:

**Frontend → State → API → Backend → Database → Response → UI**

Every existing dependency in that chain must be understood.

---

## 3. Identify all existing functionality

Create an internal inventory of every user-visible feature.

Include:

* buttons
* links
* navigation
* tabs
* forms
* filters
* dropdowns
* search
* sorting
* pagination
* charts
* metrics
* tables
* modals
* dialogs
* notifications
* alerts
* simulations
* calculations
* exports
* uploads
* downloads
* authentication
* settings
* profile functionality
* dashboards
* detail pages
* workflow actions
* API-driven functionality

Nothing should disappear accidentally.

---

## 4. Treat the current application as the source of truth for functionality

The existing implementation defines what the application currently does.

The redesign defines **how users experience it**.

Do not confuse those two responsibilities.

---

## 5. Preserve behavior

If something currently works correctly, preserve its underlying behavior unless there is a demonstrable reason to improve it.

Changing the UI does not justify changing business logic.

---

# PART II — ABSOLUTE FUNCTIONALITY RULES

## 6. Never replace functioning logic with fake UI

Do not create:

* fake metrics
* fake charts
* hardcoded statistics
* fake API responses
* fake loading states that never resolve
* fake buttons
* fake search
* fake filters
* fake notifications
* fake simulation outputs

If a feature is supposed to use real data, it must continue using real data.

---

## 7. Never hardcode dynamic application data

Do not hardcode values merely to make the redesigned interface look impressive.

Dynamic data must remain dynamic.

---

## 8. Preserve API contracts whenever possible

Existing API endpoints should remain compatible.

Do not casually rename:

* endpoints
* parameters
* fields
* response properties
* HTTP methods
* authentication behavior

---

## 9. If backend modification is necessary, do it carefully

You are allowed to modify backend code when necessary.

Examples include:

* fixing an API contract that prevents reliable frontend behavior
* improving validation
* improving error responses
* adding a genuinely necessary endpoint
* improving response structure
* fixing obvious backend defects
* adding missing functionality required by the redesigned workflow

But backend changes must be:

* minimal
* justified
* backward-compatible where practical
* tested
* documented internally
* free from accidental regressions

---

## 10. Never rewrite the backend merely because it is aesthetically inconvenient

Frontend design should adapt to backend realities where reasonable.

Do not perform unnecessary backend rewrites.

---

## 11. Never delete functionality without proving it is obsolete

Before removing anything, verify that:

* it is genuinely unused
* it is not required by another feature
* it is not part of an API contract
* it is not required for a workflow
* removing it will not cause regressions

---

## 12. Never hide broken functionality

Do not hide an existing feature simply because it is difficult to redesign.

Instead:

* understand it
* redesign it
* preserve it
* improve it

---

# PART III — DESIGN AUTHORITY

## 13. You have broad frontend creative authority

Do NOT feel obligated to preserve the existing visual structure.

You may completely rethink:

* page composition
* grid structure
* navigation
* information hierarchy
* card placement
* dashboard composition
* spacing
* visual density
* typography
* colors
* interaction patterns
* responsive layouts

---

## 14. Do not blindly follow the old UI

The existing interface is an implementation to improve, not a sacred visual specification.

---

## 15. Do not blindly follow this prompt either

The design principles below are constraints and quality targets, not instructions to produce a predictable template.

Use professional judgment.

---

## 16. Avoid generic AI-dashboard aesthetics

Do not produce something that looks like:

* a random Tailwind template
* a generic SaaS dashboard
* a generic admin panel
* a template marketplace dashboard
* a basic Bootstrap dashboard
* an overused glassmorphism landing page
* a collection of glowing cards with no hierarchy

---

## 17. Design for PAIMANA specifically

The final product should feel like a purpose-built:

**AI-powered infrastructure intelligence / predictive analytics / decision-support platform.**

The interface should communicate:

* intelligence
* confidence
* seriousness
* technical sophistication
* analytical depth
* trust
* clarity
* speed
* precision

---

# PART IV — VISUAL DIRECTION

## 18. Use the existing PAIMANA design document as a strong visual reference

The existing design direction includes:

* deep indigo
* vibrant purple
* cyan
* electric lime
* sophisticated dark neutrals
* layered depth
* intentional motion
* strong typography
* premium data visualization
* modern spacing
* accessibility-conscious interaction

Use these ideas intelligently rather than mechanically.

---

## 19. Do not turn every element neon

Accent colors should create hierarchy.

They should not overwhelm the interface.

---

## 20. Establish a visual hierarchy

Every screen should make it immediately obvious:

1. What is this page?
2. What is most important?
3. What requires attention?
4. What can I interact with?
5. What changed?
6. What should I do next?

---

## 21. Use depth intentionally

Depth may come from:

* shadows
* gradients
* borders
* layering
* translucency
* elevation
* spacing
* contrast

Do not use all of them everywhere.

---

## 22. Establish component hierarchy

Not every card should look identical.

Use visual hierarchy for:

* primary information
* secondary information
* warnings
* insights
* actions
* supporting information

The source design already distinguishes hero, data, and insight cards.

---

# PART V — TYPOGRAPHY

## 23. Typography must be intentional

Use typography to communicate hierarchy rather than merely styling text.

---

## 24. Establish a typography scale

Define consistent levels for:

* page titles
* section titles
* card titles
* labels
* descriptions
* metadata
* metrics
* warnings
* actions

---

## 25. Give numerical data special treatment

Important metrics should visually stand apart from explanatory text.

---

## 26. Preserve readability

Never sacrifice readability merely to achieve a fashionable aesthetic.

---

## 27. Avoid unnecessary uppercase text

Use uppercase primarily for:

* compact labels
* statuses
* metadata
* small section markers

Not paragraphs.

---

# PART VI — LAYOUT

## 28. Rebuild layouts when necessary

Do not preserve awkward grids simply because they already exist.

---

## 29. Use responsive composition rather than shrinking desktop

Mobile should be intentionally designed.

Do not merely compress desktop into a narrow viewport.

---

## 30. Use meaningful whitespace

Whitespace should separate concepts.

---

## 31. Avoid excessive card density

If every piece of information is inside a card, the interface becomes visually noisy.

---

## 32. Use asymmetry when appropriate

Not every section needs perfect symmetry.

---

## 33. Maintain alignment discipline

Elements should align according to a consistent underlying grid.

---

# PART VII — NAVIGATION

## 34. Completely redesign navigation if necessary

Navigation should make the product understandable.

---

## 35. Make active states unmistakable

Users should immediately know where they are.

---

## 36. Make navigation responsive

On small screens, transform navigation intelligently.

---

## 37. Never break browser navigation

Back/forward navigation must continue working.

---

## 38. Preserve deep links

If a route previously worked directly, the redesign must not accidentally destroy it.

---

## 39. Preserve URL behavior

Do not casually change route semantics.

---

# PART VIII — HEADER

## 40. Treat the header as a product-level element

It should communicate identity and state.

---

## 41. Preserve important controls

Do not remove:

* search
* status
* profile
* navigation
* settings
* notifications
* other existing controls

unless verified unnecessary.

---

## 42. Make status meaningful

If the application exposes system/AI status, display actual status.

Never fabricate it.

---

# PART IX — DASHBOARD

## 43. Redesign the dashboard around decision-making

The dashboard should answer:

* What is happening?
* What is at risk?
* What changed?
* Why did it change?
* What should happen next?

---

## 44. Prioritize information

Do not give every metric equal visual weight.

---

## 45. Make important KPIs immediately scannable

The most important numbers should be visible without requiring users to hunt.

---

## 46. Provide context alongside metrics

A number without context is often meaningless.

Where appropriate show:

* label
* unit
* trend
* comparison
* change
* status
* explanation

---

## 47. Do not over-animate KPIs

Animations should reinforce updates rather than distract.

---

# PART X — DATA VISUALIZATION

## 48. Charts must remain truthful

Never distort data for aesthetic purposes.

---

## 49. Preserve actual data relationships

Do not manipulate scales merely to make trends look dramatic.

---

## 50. Make charts readable

Charts must clearly communicate:

* axes
* units
* labels
* legends
* data points
* trends

where applicable.

---

## 51. Improve chart interaction

Use:

* hover states
* tooltips
* highlighting
* filtering
* drill-down
* contextual information

when supported by the existing functionality.

---

## 52. Do not add interaction that implies nonexistent functionality

A beautiful chart with fake drill-down is unacceptable.

---

## 53. Animate chart rendering carefully

Animations should improve comprehension.

---

## 54. Respect reduced-motion preferences

Users who disable animation should receive an appropriate static experience.

---

# PART XI — FORMS

## 55. Redesign forms completely if needed

Forms should feel deliberate and easy to understand.

---

## 56. Preserve all fields

Do not remove fields simply because they make the UI less elegant.

---

## 57. Group related fields intelligently

Use:

* sections
* progressive disclosure
* logical grouping
* contextual help

when appropriate.

---

## 58. Preserve validation

Existing validation must remain functional.

---

## 59. Improve validation UX

Errors should:

* be understandable
* appear near the relevant field
* not erase valid user input
* not create confusing UI states

---

## 60. Prevent accidental submission

Use appropriate confirmation/loading states where necessary.

---

# PART XII — BUTTONS & ACTIONS

## 61. Every button must have a real purpose

No decorative buttons.

---

## 62. Every interactive control must actually work

Before finalizing, test every:

* button
* link
* dropdown
* tab
* slider
* checkbox
* input
* modal
* action menu

---

## 63. Clearly distinguish destructive actions

Destructive actions should never look identical to ordinary actions.

---

## 64. Loading states must prevent duplicate actions

If an operation is in progress, handle repeated clicks safely.

---

## 65. Never leave users wondering whether an action worked

Provide appropriate feedback.

---

# PART XIII — LOADING STATES

## 66. Design proper loading states

Use:

* skeletons
* progress indicators
* inline loaders
* disabled states

where appropriate.

---

## 67. Loading states must reflect actual loading

Never show an infinite spinner to hide a broken API request.

---

## 68. Avoid layout jumping

Loading placeholders should approximately preserve final geometry where practical.

---

# PART XIV — ERROR STATES

## 69. Design errors as first-class UI

Errors must not look like browser accidents.

---

## 70. Explain errors clearly

Whenever possible communicate:

* what happened
* what failed
* whether the user can retry
* what action to take

---

## 71. Preserve application state after errors

A failed request should not unnecessarily destroy the user's work.

---

## 72. Distinguish recoverable and unrecoverable errors

The UI should behave differently.

---

# PART XV — EMPTY STATES

## 73. Design meaningful empty states

Empty states should explain:

* why there is no data
* whether this is expected
* what the user can do next

---

# PART XVI — RESPONSIVE DESIGN

## 74. Support small phones

Design intentionally for approximately:

* 320px
* 375px
* 390px
* 430px

---

## 75. Support tablets

Consider approximately:

* 768px
* 834px
* 1024px

---

## 76. Support desktop

Consider:

* 1280px
* 1440px
* 1920px
* 2560px

---

## 77. Prevent horizontal overflow

No accidental sideways scrolling.

---

## 78. Ensure charts resize correctly

Charts must not:

* overflow
* become unreadable
* clip labels
* overlap
* break containers

---

# PART XVII — ACCESSIBILITY

## 79. Accessibility is mandatory

Do not treat accessibility as optional polish.

---

## 80. Maintain keyboard accessibility

All important functionality must be reachable without a mouse.

---

## 81. Provide visible focus states

Focus must be obvious.

---

## 82. Preserve semantic HTML

Use appropriate:

* buttons
* links
* headings
* labels
* forms
* navigation
* landmarks

---

## 83. Do not use color alone

Warnings, success, critical states, and statuses should have additional cues.

---

## 84. Respect reduced motion

Support:

`prefers-reduced-motion`

---

## 85. Check contrast

Text and controls must remain readable.

---

# PART XVIII — MICRO-INTERACTIONS

## 86. Motion must have purpose

Every animation should answer:

**What changed?**

or

**What did my action cause?**

---

## 87. Use subtle transitions

Favor professional motion over excessive effects.

---

## 88. Use hover elevation carefully

Hover should communicate interactivity.

---

## 89. Use entrance animations selectively

Do not animate every single element independently.

---

## 90. Do not make the UI feel like a gaming interface

PAIMANA is analytical infrastructure software.

It should feel sophisticated.

---

# PART XIX — COMPONENT ARCHITECTURE

## 91. Build reusable components

Do not copy-paste similar UI structures.

---

## 92. Establish component primitives

Potential primitives include:

* Button
* Input
* Select
* Badge
* Card
* Modal
* Tooltip
* Tabs
* Table
* Chart container
* Alert
* Skeleton
* Empty state
* Error state

Use the actual application needs to determine the final architecture.

---

## 93. Avoid over-abstraction

Do not create 50 components for one tiny page.

---

## 94. Create abstraction only when it improves maintainability

Reusable does not mean unnecessarily complicated.

---

## 95. Keep components understandable

Another engineer should be able to modify them.

---

# PART XX — STATE MANAGEMENT

## 96. Preserve existing state behavior

Do not introduce unnecessary global state.

---

## 97. Separate server state and UI state where appropriate

API data and ephemeral UI state have different lifecycles.

---

## 98. Avoid duplicated sources of truth

If the same data is stored in multiple places, synchronization becomes fragile.

---

# PART XXI — API INTEGRATION

## 99. Centralize API behavior where appropriate

Use consistent handling for:

* authentication
* headers
* errors
* parsing
* retries
* timeouts

where supported.

---

## 100. Handle slow networks

The UI must remain understandable while waiting.

---

## 101. Handle API failures

Do not assume requests always succeed.

---

## 102. Handle malformed responses safely

The frontend should fail gracefully.

---

## 103. Do not swallow errors silently

Errors should be observable and appropriately communicated.

---

# PART XXII — DATA INTEGRITY

## 104. Never alter analytical meaning

If PAIMANA calculates a risk score, cost, forecast, variance, or other metric, the redesign must not alter its meaning.

---

## 105. Preserve units

If the backend provides:

* ₹
* %
* Cr
* months
* days
* ratios

display them correctly.

---

## 106. Do not invent precision

Do not show:

`87.49382%`

if the underlying product meaning is intended to be `87.5%`.

---

## 107. Use consistent formatting

Numbers should be consistently formatted throughout the application.

---

# PART XXIII — SEARCH / FILTERS / SORTING

## 108. Preserve search semantics

A redesigned search box must continue searching the same underlying data unless intentionally improved.

---

## 109. Preserve filters

Do not remove filters because they complicate the UI.

---

## 110. Make active filters visible

Users should know why they are seeing a particular subset of data.

---

## 111. Provide clear reset behavior

Users should be able to return to the default state.

---

# PART XXIV — TABLES

## 112. Tables must prioritize scanning

Important columns should be visually prioritized.

---

## 113. Preserve sorting

If existing sorting works, preserve it.

---

## 114. Preserve pagination

If existing pagination exists, preserve it.

---

## 115. Handle long values

Use appropriate:

* truncation
* tooltips
* wrapping
* expandable content

rather than breaking layouts.

---

## 116. Make tables responsive

On mobile, intelligently transform or restructure them rather than forcing unusable horizontal layouts.

---

# PART XXV — MODALS / DIALOGS

## 117. Modals must be keyboard accessible

Support:

* Escape
* focus management
* logical tab order

---

## 118. Prevent accidental destructive actions

Use confirmation when appropriate.

---

## 119. Avoid unnecessary modal usage

If information can be shown inline more effectively, consider that.

---

# PART XXVI — NOTIFICATIONS

## 120. Notifications should communicate state

Do not flood users with notifications.

---

## 121. Distinguish severity

Use appropriate hierarchy for:

* information
* success
* warning
* critical

---

## 122. Preserve important alerts

Critical infrastructure information should never be visually buried.

---

# PART XXVII — PERFORMANCE

## 123. The redesigned application must remain fast

Do not add massive libraries simply for visual effects.

---

## 124. Avoid unnecessary dependencies

Every dependency adds:

* bundle weight
* maintenance
* potential security issues
* complexity

---

## 125. Lazy-load expensive functionality where appropriate

Especially:

* chart libraries
* large visual modules
* secondary pages

---

## 126. Avoid unnecessary re-renders

Inspect component state and rendering patterns.

---

## 127. Optimize images and assets

Do not ship unnecessarily huge assets.

---

## 128. Avoid animation-induced performance problems

Animations should preferably use efficient properties.

---

# PART XXVIII — CODE QUALITY

## 129. Do not generate spaghetti code

The result must be maintainable.

---

## 130. Do not duplicate logic

Extract shared behavior when appropriate.

---

## 131. Keep naming consistent

Use meaningful names.

---

## 132. Remove dead code only after verification

Do not blindly delete.

---

## 133. Remove obsolete styling

After redesigning components, clean up styles that are genuinely unused.

---

## 134. Avoid contradictory CSS

Do not stack dozens of overrides until the UI happens to look right.

---

# PART XXIX — DESIGN SYSTEM

## 135. Establish design tokens

Centralize:

* colors
* spacing
* typography
* radii
* shadows
* transitions
* z-index layers
* breakpoints

---

## 136. Use a consistent spacing system

A base spacing rhythm should guide the interface.

The supplied PAIMANA design direction uses an 8px-based spacing system with 4px micro-adjustments and larger section spacing.

---

## 137. Establish consistent radii

Avoid random corner radii across components.

---

## 138. Establish consistent shadows

Use a deliberate elevation system.

---

## 139. Establish consistent transitions

Avoid every component having a different animation duration.

---

# PART XXX — VISUAL CONSISTENCY

## 140. Every page must feel like the same product

Even dramatically different pages should share:

* typography
* spacing
* component language
* colors
* interaction behavior
* navigation
* iconography

---

## 141. Avoid one-page redesign syndrome

Do not make the homepage beautiful while leaving secondary screens outdated.

---

## 142. Audit every screen

The redesign is complete only when the entire application feels cohesive.

---

# PART XXXI — ICONOGRAPHY

## 143. Use a consistent icon family

Do not mix unrelated visual styles.

---

## 144. Icons should support comprehension

Do not use icons purely as decoration.

---

## 145. Do not replace textual labels with ambiguous icons

Especially for important actions.

---

# PART XXXII — UX QUALITY

## 146. Reduce cognitive load

Users should not have to decode the interface.

---

## 147. Establish predictable interactions

Similar things should behave similarly.

---

## 148. Avoid surprise navigation

Do not unexpectedly move users between pages.

---

## 149. Preserve user context

When possible, retain:

* filters
* selected items
* scroll position
* form data
* navigation context

---

## 150. Make workflows obvious

Users should understand the next action.

---

# PART XXXIII — AI-SPECIFIC UX

## 151. AI output must look trustworthy

Do not make AI functionality look like a toy chatbot unless that is genuinely the intended experience.

---

## 152. Clearly distinguish generated insights from raw data

Users should understand what is:

* measured
* calculated
* predicted
* generated
* recommended

---

## 153. Avoid fake AI confidence

Never display arbitrary confidence percentages merely to make the product look intelligent.

---

## 154. Explain important predictions

Where backend capabilities support it, expose useful reasoning/context.

---

# PART XXXIV — ALERT EXPERIENCE

## 155. Critical alerts deserve priority

They should not look identical to ordinary informational cards.

---

## 156. Preserve alert identifiers

Existing IDs must remain correct.

---

## 157. Preserve alert triggers

Do not change business logic merely because the visual design changes.

---

## 158. Provide clear actions

If the existing system supports an action, make that action obvious.

---

# PART XXXV — SIMULATION EXPERIENCE

## 159. Treat simulations as high-value workflows

A predictive simulator should feel like a serious analytical tool.

---

## 160. Make inputs understandable

Users should know:

* what they control
* what the units mean
* what the input affects

---

## 161. Make outputs understandable

Do not merely dump raw numbers.

---

## 162. Preserve actual simulation logic

The frontend must never substitute fake calculations.

---

# PART XXXVI — MOBILE UX

## 163. Mobile navigation must be usable

Do not simply shrink desktop navigation.

---

## 164. Touch targets must be sufficiently large

Important controls should be easy to tap.

---

## 165. Avoid tiny chart interactions

Provide touch-friendly alternatives.

---

# PART XXXVII — SECURITY

## 166. Never expose secrets

Do not place:

* API keys
* credentials
* private tokens
* secrets

into frontend code.

---

## 167. Preserve authentication behavior

Do not weaken authentication to make development easier.

---

## 168. Do not trust frontend validation alone

Backend validation remains authoritative.

---

# PART XXXVIII — TESTING

## 169. Test every existing workflow

Do not test only the homepage.

---

## 170. Test every route

Every route must load correctly.

---

## 171. Test every interactive element

Click everything important.

---

## 172. Test API-driven screens

Verify actual requests and responses.

---

## 173. Test failed requests

Simulate:

* network failure
* server error
* invalid response
* timeout

where practical.

---

## 174. Test forms

Verify:

* valid submission
* invalid submission
* missing fields
* loading
* success
* failure

---

## 175. Test responsive behavior

Inspect major breakpoints.

---

## 176. Test keyboard navigation

Verify the major workflows without a mouse.

---

## 177. Test visual regressions

Compare redesigned screens against intended behavior.

---

# PART XXXIX — BUILD VALIDATION

## 178. The project must build successfully

Run the actual build process.

Do not assume.

---

## 179. Fix all compile errors

No known compile errors should remain.

---

## 180. Fix runtime errors

The browser console should not be filled with application errors.

---

## 181. Fix broken imports

Do not leave unresolved dependencies.

---

## 182. Verify environment requirements

Do not accidentally introduce requirements that make the project impossible to run.

---

# PART XL — BROWSER VALIDATION

## 183. Inspect the application in an actual browser environment when available

Do not rely solely on static code inspection.

---

## 184. Check visual hierarchy at real viewport sizes

A component that looks good in code may fail visually in practice.

---

## 185. Check overflow

Inspect:

* horizontal overflow
* clipped content
* overflowing dialogs
* overflowing charts
* broken tables

---

# PART XLI — DESIGN REVIEW

## 186. Perform a visual audit

Ask:

* Does it look premium?
* Does it look intentional?
* Does it look modern?
* Does it look trustworthy?
* Does it feel like one coherent product?
* Is information easy to scan?
* Are important elements visually prioritized?

---

## 187. Perform a functionality audit

Ask:

* Did every previous workflow survive?
* Do API calls still work?
* Are calculations unchanged?
* Do forms still submit?
* Do charts still use real data?
* Does navigation work?
* Do filters work?
* Do alerts work?

---

# PART XLII — ANTI-PATTERNS

## 188. Do NOT make everything glow

Glow is an accent, not a default.

---

## 189. Do NOT use excessive gradients

Gradients should create hierarchy and depth.

---

## 190. Do NOT use excessive glassmorphism

Avoid the "every card is frosted glass" problem.

---

## 191. Do NOT use excessive rounded corners

Modern does not mean everything must be a pill.

---

## 192. Do NOT overuse animations

Motion should communicate something.

---

## 193. Do NOT use giant typography everywhere

Hierarchy requires contrast.

---

## 194. Do NOT turn every element into a card

Some information should breathe directly on the page.

---

## 195. Do NOT sacrifice density when density is useful

Infrastructure analytics can legitimately contain substantial information.

The objective is:

**high information density + high visual clarity**

not:

**low information density + lots of empty space.**

---

# PART XLIII — CREATIVE FREEDOM

## 196. You are encouraged to invent better layouts

If the existing layout is inferior, replace it.

---

## 197. You are encouraged to invent better interactions

If an interaction can be made substantially clearer, improve it.

---

## 198. You are encouraged to introduce new reusable UI patterns

Provided they do not break existing functionality.

---

## 199. You are encouraged to redesign entire screens

A screen may be structurally rebuilt from scratch.

---

## 200. You are encouraged to challenge existing design assumptions

Do not preserve bad design simply because it already exists.

---

# PART XLIV — BUT NEVER CROSS THIS LINE

## 201. Creative freedom ends at functionality

If a visual idea breaks:

* usability
* accessibility
* performance
* responsiveness
* data integrity
* API integration
* existing workflows

reject the visual idea.

---

## 202. Engineering quality outranks visual novelty

A sophisticated boring component is better than a spectacular broken component.

---

## 203. Never optimize screenshots instead of users

The product must work in real interaction.

---

# PART XLV — IMPLEMENTATION STRATEGY

## 204. Work in phases

Do not attempt a blind massive rewrite.

Recommended sequence:

### Phase A

Repository reconnaissance.

### Phase B

Functionality inventory.

### Phase C

Architecture understanding.

### Phase D

Design system.

### Phase E

Global shell.

### Phase F

Navigation.

### Phase G

Core components.

### Phase H

Primary dashboard.

### Phase I

Secondary pages.

### Phase J

Forms.

### Phase K

Charts.

### Phase L

Responsive behavior.

### Phase M

Accessibility.

### Phase N

Performance.

### Phase O

Testing.

### Phase P

Final polish.

---

## 205. Establish the design system before styling dozens of pages

Otherwise the application will become inconsistent.

---

## 206. Refactor repeated UI patterns

Do this progressively rather than blindly.

---

# PART XLVI — FRONTEND REWRITE AUTHORITY

## 207. You may restructure the frontend extensively

You may change:

* component hierarchy
* folder structure
* CSS architecture
* styling system
* component library
* state architecture
* routing organization

if the result is better and stable.

---

## 208. You may replace poor implementations

If an existing frontend implementation is brittle, replace it.

---

## 209. You may introduce a proper design system

But keep the implementation understandable.

---

# PART XLVII — BACKEND MODIFICATION AUTHORITY

## 210. Backend changes are permitted when necessary

You may modify backend implementation if required to:

* repair broken behavior
* improve integration
* expose required data
* improve validation
* improve reliability
* support necessary UI functionality

---

## 211. Backend changes must be conservative

Do not rewrite working backend systems just for architectural fashion.

---

## 212. Preserve existing API compatibility where practical

If a breaking change is genuinely necessary, update every dependent caller and verify the complete workflow.

---

# PART XLVIII — DEPENDENCY POLICY

## 213. Do not install dependencies casually

Before adding a package, ask:

1. Is it actually needed?
2. Is the functionality already available?
3. Is the dependency maintained?
4. Does it significantly increase bundle size?
5. Does it complicate the architecture?

---

## 214. Prefer existing project technology

Work with the project's established stack unless there is a strong reason not to.

---

# PART XLIX — FINAL PRODUCT STANDARD

## 215. The final result should feel handcrafted

Avoid obvious AI-generated patterns.

---

## 216. Every screen should have visual intention

There should be a reason for:

* spacing
* alignment
* color
* hierarchy
* interaction
* typography

---

## 217. The product should feel premium without becoming flashy

Premium means:

* coherent
* precise
* restrained
* responsive
* fast
* polished
* trustworthy

---

## 218. The product should feel intelligent

But intelligence should come from:

* data
* analysis
* useful interaction
* clear presentation

not decorative "AI" labels everywhere.

---

# PART L — FINAL VERIFICATION CHECKLIST

Before declaring the task complete, verify all of the following.

## FUNCTIONALITY

### 219.

All routes work.

### 220.

All navigation works.

### 221.

All existing buttons work.

### 222.

All forms work.

### 223.

All API calls work.

### 224.

All dynamic data remains dynamic.

### 225.

All calculations remain correct.

### 226.

All charts use real data.

### 227.

All filters work.

### 228.

All search functionality works.

### 229.

All sorting works.

### 230.

All modals work.

### 231.

All alerts work.

### 232.

All simulation workflows work.

### 233.

Authentication still works.

### 234.

Authorization behavior remains intact.

---

# VISUAL QUALITY

### 235.

No page looks unfinished.

### 236.

No page looks like the old UI with random colors added.

### 237.

Typography is coherent.

### 238.

Spacing is coherent.

### 239.

Colors are coherent.

### 240.

Cards are coherent.

### 241.

Charts are coherent.

### 242.

Buttons are coherent.

### 243.

Navigation is coherent.

### 244.

States are coherent.

---

# RESPONSIVENESS

### 245.

Mobile works.

### 246.

Tablet works.

### 247.

Desktop works.

### 248.

Large monitors work.

### 249.

No horizontal overflow exists unintentionally.

### 250.

No important content is clipped.

---

# ACCESSIBILITY

### 251.

Keyboard navigation works.

### 252.

Focus states are visible.

### 253.

Color is not the only status indicator.

### 254.

Text remains readable.

### 255.

Forms have appropriate labels.

### 256.

Interactive controls have meaningful accessible names.

### 257.

Reduced motion is respected.

---

# PERFORMANCE

### 258.

No obvious unnecessary rendering exists.

### 259.

No excessive dependency bloat was introduced.

### 260.

Heavy functionality is loaded appropriately.

### 261.

Animations do not cause obvious performance problems.

### 262.

Charts remain responsive.

---

# ENGINEERING

### 263.

No known compile errors.

### 264.

No known runtime errors.

### 265.

No unresolved imports.

### 266.

No fake functionality.

### 267.

No unnecessary hardcoded data.

### 268.

No accidental API changes.

### 269.

No secrets exposed.

### 270.

No major dead code introduced.

---

# PART LI — FINAL SELF-CRITIQUE

Before finishing, do NOT simply say "done."

Perform a hostile review of your own work.

Pretend another senior engineer is trying to break it.

Ask:

### 271.

What existing feature might I have accidentally broken?

### 272.

What API call might no longer match?

### 273.

What happens if the backend is slow?

### 274.

What happens if the backend returns an error?

### 275.

What happens if the API returns no data?

### 276.

What happens if a field is null?

### 277.

What happens if a string is extremely long?

### 278.

What happens on a 320px screen?

### 279.

What happens on a 2560px screen?

### 280.

What happens when the user presses Tab?

### 281.

What happens when the user presses Escape?

### 282.

What happens when the user double-clicks an action?

### 283.

What happens when the network disconnects?

### 284.

What happens when a chart has unusually large values?

### 285.

What happens when a chart has zero values?

### 286.

What happens when there are hundreds of records?

### 287.

What happens when there are zero records?

### 288.

What happens when the user refreshes the page?

### 289.

What happens when the user directly opens a deep URL?

### 290.

What happens when authentication expires?

### 291.

What happens when the user submits invalid data?

### 292.

What happens when an operation takes 30 seconds?

### 293.

What happens if the user repeats an action?

### 294.

What happens if two API requests finish in the opposite order?

### 295.

What happens if the browser is zoomed?

### 296.

What happens with reduced motion enabled?

---

# PART LII — FINAL QUALITY BAR

The final PAIMANA application must satisfy this principle:

> **Do not build a prettier version of the old application. Build a substantially better product experience on top of the existing working system.**

The frontend should be capable of being substantially redesigned.

The backend should remain stable wherever possible.

Backend modification is allowed when necessary.

Functionality must never be sacrificed for appearance.

Data must never be fabricated for appearance.

Business logic must never be silently changed.

The result must not merely "look modern."

It must be:

**modern + usable + responsive + accessible + performant + reliable + maintainable + data-correct + production-quality.**

---

# PART LIII — MOST IMPORTANT INSTRUCTION

Do not stop after making the first visual pass.

The first pass is expected to be imperfect.

After implementation:

1. inspect
2. run
3. test
4. identify failures
5. identify inconsistencies
6. fix them
7. inspect again
8. test again
9. refine visual hierarchy
10. verify functionality again

Repeat until the application is genuinely polished.

Do not optimize for speed of completion.

Optimize for **quality of the final product**.

---

# PART LIV — DO NOT ASK FOR PERMISSION FOR OBVIOUS FRONTEND IMPROVEMENTS

You have authority to make frontend decisions.

Do not repeatedly ask:

"Should I change this card?"

"Should I change this color?"

"Should I redesign this page?"

"Should I improve this layout?"

If the change clearly improves the product and does not compromise functionality, **make the decision yourself.**

Use professional judgment.

---

# PART LV — DO ASK WHEN THE DECISION WOULD CHANGE FUNCTIONAL MEANING

If a change could alter:

* business logic
* data interpretation
* permissions
* API semantics
* financial calculations
* predictive logic
* security
* user authorization

do not make assumptions.

Inspect the existing implementation first.

If genuinely ambiguous after inspection, preserve existing behavior rather than inventing new behavior.

---

# PART LVI — FINAL COMMAND

You are not being asked to produce a design concept.

You are not being asked to produce a mockup.

You are not being asked to produce a static frontend.

You are not being asked to merely recolor the existing application.

You are being asked to **engineer and redesign the actual PAIMANA application.**

Take complete frontend ownership.

Preserve the backend and functionality wherever possible.

Modify backend code when genuinely necessary.

Do not break existing features.

Do not fabricate data.

Do not hardcode dynamic results.

Do not leave fake buttons.

Do not leave placeholder functionality.

Do not stop at a visual mockup.

Do not declare success merely because the page compiles.

The final result must be a **fully functioning, deeply polished, production-quality PAIMANA AI experience.**

**Inspect → Understand → Plan → Redesign → Implement → Test → Break → Fix → Polish → Retest → Deliver.**

That is the standard.
