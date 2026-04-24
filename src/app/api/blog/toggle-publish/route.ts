import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { requireAdminOr401 } from '@/lib/admin-guard';

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdminOr401();
    if (!authResult.ok) return authResult.response;

    // Parse request body
    const { id, published } = await request.json();

    if (!id || typeof published !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Update the blog post's published status
    const result = await writeClient
      .patch(id)
      .set({ published })
      .commit();

    return NextResponse.json({ 
      success: true, 
      published: result.published,
      message: `Blog ${published ? 'published' : 'unpublished'} successfully` 
    });

  } catch (error) {
    console.error('Error toggling publish status:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
