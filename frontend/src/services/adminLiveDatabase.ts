import { focseraAdmin } from '@/lib/supabase';
import { AdminVendorRecord, AdminCategoryRecord, AdminSupportTicket } from '@/types/admin';
import { VendorManagedProduct } from '@/types/vendor';

export async function getLiveAdminVendors(): Promise<AdminVendorRecord[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('partner_profiles')
      .select('*')
      .limit(60);

    if (!error && data && data.length > 0) {
      return data.map((p: any) => ({
        id: p.id,
        slug: (p.display_name || p.name || 'partner').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        businessName: p.display_name || p.name,
        category: p.category || 'General',
        ownerName: p.name,
        phone: p.phone || p.phone_number || '+91 98450 00000',
        email: p.email || 'partner@focsera.com',
        locality: 'Bengaluru Core',
        city: 'Bengaluru',
        gstNumber: '29ABCDE1234F1Z5',
        fssaiNumber: '21223190000412',
        verificationStatus: p.is_verified ? ('Verified' as const) : ('Pending Review' as const),
        accountStatus: 'Active' as const,
        joinedDate: p.created_at ? p.created_at.slice(0, 10) : '2026-01-15',
        productCount: 8,
        totalOrders: p.reviews_count * 2 || 140,
        grossSales: (p.price || 2000) * (p.reviews_count || 10),
        rating: Number(p.rating) || 4.9,
        plan: 'Standard Growth',
        planExpiry: '2027-01-01',
        documents: {
          fssaiDoc: 'FSSAI_VERIFIED.pdf',
          gstDoc: 'GST_CERT.pdf',
          storefrontPhoto: p.avatar_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        },
      }));
    }
  } catch (e) {
    console.error('Failed to query partner_profiles for admin:', e);
  }
  return [];
}

export async function getLiveAdminCategories(): Promise<AdminCategoryRecord[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('home_partner_types')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((c: any, idx: number) => ({
        id: c.id,
        slug: (c.category || c.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: c.title,
        description: c.description || '',
        image: c.image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        displayOrder: c.display_order || idx + 1,
        isEnabled: c.is_active !== false,
        productCount: 12,
        vendorCount: 8,
      }));
    }
  } catch (e) {
    console.error('Failed to query home_partner_types for admin:', e);
  }
  return [];
}

export async function getLiveAdminTickets(): Promise<AdminSupportTicket[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('service_reviews')
      .select('*')
      .limit(30);

    if (!error && data && data.length > 0) {
      return data.map((r: any, idx: number) => ({
        id: `TCK-${r.id ? r.id.slice(0, 6) : 1000 + idx}`,
        ticketNumber: `TKT-2026-${100 + idx}`,
        requesterType: 'Customer' as const,
        requesterName: r.client_name || 'Customer Reviewer',
        requesterContact: '+91 98450 00000',
        relatedOrderId: r.booking_id || r.id || 'ORD-902',
        issueCategory: 'Late Delivery' as const,
        priority: (r.rating <= 2 ? 'High' : 'Medium') as any,
        status: (r.rating >= 4 ? 'Resolved' : 'Open') as any,
        assignedAgent: 'Admin Support',
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.created_at || new Date().toISOString(),
        description: r.review_text || r.feedback || 'Review submitted through platform',
        conversation: [
          {
            sender: r.client_name || 'Customer',
            role: 'customer' as const,
            timestamp: r.created_at || new Date().toISOString(),
            message: r.review_text || 'Submitted review',
          },
        ],
        internalNotes: 'Automated live ticket from service_reviews.',
      }));
    }
  } catch (e) {
    console.error('Failed to query service_reviews for tickets:', e);
  }
  return [];
}

export async function getLiveVendorProducts(): Promise<VendorManagedProduct[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('unified_packages')
      .select('*')
      .limit(50);

    if (!error && data && data.length > 0) {
      return data.map((pkg: any) => {
        const price = Number(pkg.price_min) || Number(pkg.price) || 2500;
        const variantId = `${pkg.id}-std`;
        return {
          id: pkg.id,
          slug: pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: pkg.name,
          shortDescription: pkg.description ? pkg.description.slice(0, 90) + '...' : '',
          description: pkg.description || pkg.name,
          category: 'Groceries' as const,
          subCategory: pkg.metadata?.category || pkg.domain || 'Standard',
          image: pkg.thumbnail || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
          variants: [
            {
              id: variantId,
              name: pkg.metadata?.pricing_mode || 'Standard',
              price,
              originalPrice: Math.round(price * 1.15),
              stockQty: 50,
              inStock: true,
            },
          ],
          defaultVariantId: variantId,
          status: 'published' as const,
          isPopular: true,
          totalSold: 42,
          lastUpdated: pkg.updated_at || new Date().toISOString(),
          vendorId: 'partner-active',
          vendorName: 'Kiran Bose & Team',
          vendorSlug: 'kiran-bose-team',
        };
      });
    }
  } catch (e) {
    console.error('Failed to query unified_packages for vendor:', e);
  }
  return [];
}
