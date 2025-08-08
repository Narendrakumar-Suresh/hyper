
import { mockBadges } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BadgesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Badges</h1>
        <p className="text-muted-foreground">
          Earn badges for your contributions and achievements in the community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBadges.map((badge) => (
          <Card key={badge.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <badge.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{badge.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{badge.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
