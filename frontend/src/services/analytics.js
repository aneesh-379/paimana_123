/**
 * PAIMANA Analytics Abstraction
 * Disabled by default. Zero external network tracking unless an official measurement ID is configured.
 */

// Configuration Placeholder: Replace with actual Measurement ID (e.g. 'G-XXXXXXXXXX') when authorized
export const PAIMANA_ANALYTICS_ID = null;

class AnalyticsService {
  constructor() {
    this.enabled = Boolean(PAIMANA_ANALYTICS_ID);
    if (this.enabled) {
      console.info(`[PAIMANA Analytics] Initialized with ID: ${PAIMANA_ANALYTICS_ID}`);
    }
  }

  logEvent(eventName, params = {}) {
    if (!this.enabled) {
      // Safe no-op in development and offline environments
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          ...params,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn(`[PAIMANA Analytics] Failed to emit event ${eventName}:`, e.message);
    }
  }

  trackPageView(pageId) {
    this.logEvent('page_view', { page_id: pageId });
  }

  trackProjectOpened(projectCode) {
    this.logEvent('project_opened', { project_code: projectCode });
  }

  trackAIQuery(queryLength, hasAttachment = false) {
    this.logEvent('ai_query_submitted', { query_length: queryLength, has_attachment: hasAttachment });
  }

  trackSimulatorRun(shockType) {
    this.logEvent('simulator_executed', { shock_type: shockType });
  }

  trackWarningAction(actionId, approved) {
    this.logEvent('warning_reviewed', { action_id: actionId, decision: approved ? 'approved' : 'rejected' });
  }

  trackCTAClick(ctaLabel, targetView) {
    this.logEvent('cta_clicked', { label: ctaLabel, target: targetView });
  }
}

export const analytics = new AnalyticsService();
export const trackEvent = (name, params) => analytics.logEvent(name, params);
