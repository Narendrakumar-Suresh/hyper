
import { Award } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserAvatar } from '@/components/UserAvatar';
import { mockUsers } from '@/lib/data';

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort(
    (a, b) => b.reputation - a.reputation
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who's making the biggest impact in the community.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Ranked by reputation points earned from contributions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Reputation</TableHead>
                <TableHead className="hidden md:table-cell">Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-lg">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <UserAvatar user={user} className="h-10 w-10" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {user.reputation.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                       <Badge variant="secondary">
                         <Award className="mr-1 h-3 w-3" />
                         Pro
                       </Badge>
                       <Badge variant="secondary">
                         <Award className="mr-1 h-3 w-3" />
                         Mentor
                       </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
