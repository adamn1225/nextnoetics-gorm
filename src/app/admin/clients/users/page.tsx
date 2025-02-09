'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import AdminLayout from '../../AdminLayout';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
    cms_token: string | null;
};
type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];

const AdminClientsPage = () => {
    const [clients, setClients] = useState<Profile[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch clients
                const { data: clientsData, error: clientsError } = await supabase
                    .from('profiles')
                    .select('*, organization_members (cms_token)')
                    .eq('role', 'client');

                if (clientsError) {
                    throw clientsError;
                }

                const clientsWithToken = clientsData.map((client: any) => ({
                    ...client,
                    cms_token: client.organization_members?.cms_token || null,
                }));

                setClients(clientsWithToken || []);

                // Fetch organizations
                const { data: organizationsData, error: organizationsError } = await supabase
                    .from('organizations')
                    .select('*');

                if (organizationsError) {
                    throw organizationsError;
                }

                setOrganizations(organizationsData || []);

                // Fetch organization members
                const { data: organizationMembersData, error: organizationMembersError } = await supabase
                    .from('organization_members')
                    .select('*');

                if (organizationMembersError) {
                    throw organizationMembersError;
                }

                setOrganizationMembers(organizationMembersData || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Client Profiles</h1>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Company</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Organization</th>
                            <th className="py-2 px-4 border-b">CMS Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => {
                            const organizationMember = organizationMembers.find(member => member.user_id === client.user_id);
                            const organization = organizations.find(org => org.id === organizationMember?.organization_id);

                            return (
                                <tr key={client.id}>
                                    <td className="py-2 px-4 border-b text-center">{client.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{client.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{client.phone}</td>
                                    <td className="py-2 px-4 border-b text-center">{client.company_name}</td>
                                    <td className="py-2 px-4 border-b text-center">{client.role}</td>
                                    <td className="py-2 px-4 border-b text-center">{organization?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b text-center">{client.cms_token || 'None Generated'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminClientsPage;