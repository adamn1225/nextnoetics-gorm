const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async () => {
    const { data: events, error } = await supabase
        .from('smm_calendar')
        .select('*')
        .eq('post_due_date', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching events:', error);
        return { statusCode: 500, body: 'Error fetching events' };
    }

    const notifications = events.map(event => ({
        user_id: event.user_id,
        title: 'Upcoming Event',
        message: `You have an event scheduled for tomorrow: ${event.title}`,
        type: 'info',
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

    if (insertError) {
        console.error('Error inserting notifications:', insertError);
        return { statusCode: 500, body: 'Error inserting notifications' };
    }

    return { statusCode: 200, body: 'Notifications created successfully' };
};