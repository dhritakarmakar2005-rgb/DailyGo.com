/**
 * Safe Storage Utility
 * Prevents Uncaught DOMException, SecurityError, and SyntaxError
 * when accessing localStorage in restricted iframes, private browsing,
 * or when corrupted data exists in browser cache.
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] getItem failed for "${key}":`, e);
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeStorage] setItem failed for "${key}":`, e);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] removeItem failed for "${key}":`, e);
    }
  },

  getJSON: <T>(key: string, fallback: T): T => {
    try {
      const raw = safeStorage.getItem(key);
      if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      if (parsed === null || parsed === undefined) {
        return fallback;
      }
      return parsed as T;
    } catch (e) {
      console.warn(`[SafeStorage] Failed parsing JSON for "${key}", reverting to fallback:`, e);
      return fallback;
    }
  },

  getArray: <T>(key: string, fallback: T[]): T[] => {
    const result = safeStorage.getJSON<unknown>(key, fallback);
    if (!Array.isArray(result)) {
      return fallback;
    }
    // Clean out null, undefined, or empty items
    return result.filter(item => item !== null && item !== undefined) as T[];
  },

  setJSON: (key: string, value: unknown): void => {
    try {
      const stringified = JSON.stringify(value);
      safeStorage.setItem(key, stringified);
    } catch (e) {
      console.warn(`[SafeStorage] setJSON failed for "${key}":`, e);
    }
  },

  clearAppKeys: (): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove = [
          'td_user',
          'td_all_customers',
          'td_customer_auth',
          'td_admin_auth',
          'td_shops',
          'td_products',
          'td_cart',
          'td_orders',
          'td_partners',
          'td_active_portal',
          'td_selected_location',
          'td_coupons',
          'td_banners',
          'td_settings',
          'td_delivery_zones',
          'td_notifs',
        ];
        keysToRemove.forEach(k => {
          try {
            window.localStorage.removeItem(k);
          } catch {
            // ignore
          }
        });
      }
    } catch {
      // ignore
    }
  }
};
