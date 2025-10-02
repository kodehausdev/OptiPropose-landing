// lib/firestore.ts
'use client';

import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
} from 'firebase/firestore';
import app from './firebase';

export const db = getFirestore(app);

// In-memory cache to prevent rapid duplicate submissions
const submissionCache = new Map<string, number>();
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Add user to waitlist
 * This will ALWAYS track engagement, but only add to waitlist if it's a new email
 * Firebase rules or backend will handle duplicate prevention
 */
export async function addToWaitlist(
  email: string, 
  source: string, 
  referralCode = '', 
  metadata: Record<string, any> = {}
) {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check in-memory cache first (prevents rapid duplicate clicks)
  const cachedTime = submissionCache.get(normalizedEmail);
  const now = Date.now();
  
  if (cachedTime && (now - cachedTime) < CACHE_DURATION) {
    throw new Error('Please wait a moment before submitting again.');
  }
  
  // Add to cache immediately
  submissionCache.set(normalizedEmail, now);
  
  // Clean up old cache entries
  setTimeout(() => {
    submissionCache.delete(normalizedEmail);
  }, CACHE_DURATION);
  
  try {
    // Generate referral code
    const finalReferralCode = referralCode || generateReferralCode();
    
    // ALWAYS track engagement first (this always succeeds)
    await trackEngagement(normalizedEmail, 'waitlist_signup', {
      source,
      timestamp: new Date().toISOString()
    });
    
    // Try to add to waitlist (might fail if duplicate, that's OK)
    try {
      const docRef = await addDoc(collection(db, 'waitlist'), {
        email: normalizedEmail,
        source,
        status: 'pending',
        timestamp: serverTimestamp(),
        referralCode: finalReferralCode,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        },
      });
      
      return { id: docRef.id, referralCode: finalReferralCode, isNew: true };
    } catch (waitlistError: any) {
      // If adding to waitlist fails, it's likely a duplicate
      // But we still return success because engagement was tracked
      console.log('Waitlist add failed (likely duplicate):', waitlistError.message);
      return { id: null, referralCode: finalReferralCode, isNew: false };
    }
    
  } catch (error: any) {
    // Remove from cache if there was an error
    submissionCache.delete(normalizedEmail);
    throw error;
  }
}

/**
 * Track engagement event
 * This is separate and always succeeds
 */
export async function trackEngagement(
  email: string, 
  event: string, 
  data: any = {}
) {
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const docRef = await addDoc(collection(db, 'engagement'), {
      email: normalizedEmail,
      event,
      data,
      timestamp: serverTimestamp(),
      metadata: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location.href : null,
      },
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error tracking engagement:', error);
    // Don't throw - engagement tracking shouldn't break the app
    return null;
  }
}

// Generate a unique referral code
function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
