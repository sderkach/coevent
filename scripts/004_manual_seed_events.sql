-- Manual seeding script for CoEvent sample events
-- Run this in your Supabase SQL editor to populate sample events

-- First, you need to have at least one user in your system
-- If you don't have any users yet, sign up through the app first, then run this script

-- Get the first user ID (replace with your actual user ID if needed)
-- You can find your user ID in the Supabase dashboard under Authentication > Users
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user from auth.users
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        -- Insert sample events
        INSERT INTO public.events (
            title, description, location, event_type, date, end_date, 
            price, is_free, max_attendees, image_url, organizer_id
        ) VALUES 
        (
            'Tech Meetup: Next.js 14 Deep Dive',
            'Join us for an in-depth exploration of Next.js 14 features, including the new App Router, Server Components, and performance improvements. Perfect for developers looking to stay up-to-date with modern React development.',
            'Tech Hub Downtown',
            'in-person',
            NOW() + INTERVAL '7 days',
            NOW() + INTERVAL '7 days 2 hours',
            0,
            true,
            50,
            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
            first_user_id
        ),
        (
            'Virtual Design Workshop',
            'Learn the fundamentals of UI/UX design in this hands-on workshop. We''ll cover user research, wireframing, prototyping, and design systems. Bring your laptop and creativity!',
            'Zoom Meeting',
            'online',
            NOW() + INTERVAL '10 days',
            NOW() + INTERVAL '10 days 3 hours',
            25,
            false,
            30,
            'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
            first_user_id
        ),
        (
            'Community Garden Volunteer Day',
            'Help us maintain our community garden! We''ll be planting vegetables, weeding, and learning about sustainable gardening practices. All skill levels welcome. Tools and refreshments provided.',
            'Community Garden - 123 Green Street',
            'in-person',
            NOW() + INTERVAL '14 days',
            NOW() + INTERVAL '14 days 4 hours',
            0,
            true,
            25,
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
            first_user_id
        ),
        (
            'Photography Masterclass',
            'Professional photographer Sarah Johnson will teach advanced photography techniques including composition, lighting, and post-processing. Bring your camera and questions!',
            'Art Gallery Studio',
            'in-person',
            NOW() + INTERVAL '21 days',
            NOW() + INTERVAL '21 days 5 hours',
            75,
            false,
            15,
            'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=400&fit=crop',
            first_user_id
        ),
        (
            'Book Club: Sci-Fi Discussion',
            'Join our monthly book club discussion of ''The Martian'' by Andy Weir. We''ll explore themes of survival, science, and human resilience. New members always welcome!',
            'Public Library - Meeting Room A',
            'in-person',
            NOW() + INTERVAL '28 days',
            NOW() + INTERVAL '28 days 90 minutes',
            0,
            true,
            20,
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
            first_user_id
        ),
        (
            'Cooking Class: Italian Cuisine',
            'Learn to make authentic Italian pasta and sauces from scratch! Chef Marco will guide you through traditional techniques. All ingredients and equipment provided.',
            'Culinary School Kitchen',
            'in-person',
            NOW() + INTERVAL '35 days',
            NOW() + INTERVAL '35 days 3 hours',
            45,
            false,
            12,
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
            first_user_id
        );
        
        RAISE NOTICE 'Successfully seeded 6 sample events for user: %', first_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please sign up through the app first, then run this script again.';
    END IF;
END $$;
