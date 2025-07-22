import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Crown, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeUserContent } from '@/lib/sanitize';

const adminRequestSchema = z
  .object({
    requestedRole: z.enum(['clubAdmin', 'superAdmin'], {
      required_error: 'Please select a role to request',
    }),
    reason: z
      .string()
      .trim()
      .min(50, 'Please provide a detailed reason (at least 50 characters)')
      .max(1000, 'Reason must be less than 1000 characters'),
    experience: z
      .string()
      .trim()
      .min(20, 'Please describe your relevant experience (at least 20 characters)')
      .max(500, 'Experience description must be less than 500 characters'),
    clubName: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // Conditional validation: clubName is required for clubAdmin role
    if (data.requestedRole === 'clubAdmin' && (!data.clubName || data.clubName.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Club name is required and must be at least 2 characters when requesting Club Admin role.',
        path: ['clubName'],
      });
    }
  });

type AdminRequestFormData = z.infer<typeof adminRequestSchema>;

interface AdminRequestFormProps {
  onSuccess?: () => void;
}

export function AdminRequestForm({ onSuccess }: AdminRequestFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<AdminRequestFormData>({
    resolver: zodResolver(adminRequestSchema),
    defaultValues: {
      reason: '',
      experience: '',
      clubName: '',
    },
  });

  const selectedRole = form.watch('requestedRole');

  const onSubmit = async (data: AdminRequestFormData) => {
    setApiError(null);
    
    try {
      // Sanitize all text inputs
      const sanitizedData = {
        ...data,
        reason: sanitizeUserContent(data.reason),
        experience: sanitizeUserContent(data.experience),
        clubName: data.clubName ? sanitizeUserContent(data.clubName) : undefined,
      };

      console.log('Submitting admin request:', sanitizedData);

      // TODO: Replace with actual API call
      const response = await fetch('/api/admin/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit admin request');
      }

      toast.success('Admin request submitted successfully! You will be notified once it has been reviewed.');
      form.reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'clubAdmin':
        return {
          icon: Users,
          color: 'text-blue-600',
          description: 'Manage club events, approve members, and moderate club content',
          requirements: 'Active club member with leadership experience',
        };
      case 'superAdmin':
        return {
          icon: Crown,
          color: 'text-purple-600',
          description: 'Platform-wide administration, user management, and system oversight',
          requirements: 'Proven administrative experience and strong technical background',
        };
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <span>Request Admin Privileges</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Request elevated permissions to help manage the platform. All requests are reviewed by existing administrators.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current User Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Current Account</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Current Role:</span> <Badge variant="outline">{user?.role}</Badge></p>
          </div>
        </div>

        {/* Display API error if it exists */}
        {apiError && (
          <Alert variant="destructive">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="requestedRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the role you want to request" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clubAdmin">Club Administrator</SelectItem>
                      <SelectItem value="superAdmin">Super Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Information */}
            {selectedRole && (
              <div className="p-4 border rounded-lg bg-muted/30">
                {(() => {
                  const roleInfo = getRoleInfo(selectedRole);
                  if (!roleInfo) return null;
                  const Icon = roleInfo.icon;
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${roleInfo.color}`} />
                        <h4 className="font-medium">
                          {selectedRole === 'clubAdmin' ? 'Club Administrator' : 'Super Administrator'}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
                      <div className="flex items-start space-x-2 text-sm">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">
                          <span className="font-medium">Requirements:</span> {roleInfo.requirements}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Club Name - Required for Club Admin */}
            {selectedRole === 'clubAdmin' && (
              <FormField
                control={form.control}
                name="clubName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please specify which club you want to administer"
                        className="min-h-16 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain why you want admin privileges and how you plan to use them to benefit the community"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your relevant experience in leadership, administration, or community management"
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting ? 'Submitting Request...' : 'Submit Request'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={form.formState.isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </Form>

        {/* Additional Information */}
        <div className="text-sm text-muted-foreground bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
          <h4 className="font-medium text-blue-900 mb-2">Review Process</h4>
          <ul className="space-y-1 text-blue-800">
            <li>• Your request will be reviewed by existing administrators</li>
            <li>• You will be notified via email once a decision has been made</li>
            <li>• The review process typically takes 1-3 business days</li>
            <li>• You may be contacted for additional information if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}