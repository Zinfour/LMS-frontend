import { Button } from '@/components/ui/button';
import CreateNewUserModal from '@/components/CreateNewUserModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserImage from '@/components/UserImage';
import useGetCourses from '@/hooks/useGetCourses';
import { useGetUsers } from '@/hooks/useGetUsers';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  Select,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const RolesOptions = [
  { label: 'Select a role', value: '' },
  { label: 'Student', value: 'student' },
  { label: 'Teacher', value: 'teacher' },
];

export default function Users() {
  const { data: users, isLoading, isError } = useGetUsers();
  const { data: courses, isLoading: isCoursesLoading } = useGetCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>('');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
  };

  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) && (selectedRole ? user.role.toLowerCase() === selectedRole : true)
    );
  });

  return (
    <div className="px-8 py-10 max-w-7xl ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <CreateNewUserModal />
      </div>
      <Separator className="mb-6 h-px" />
      <div>
        <p className="text-sm font-light text-muted-foreground mb-2">Filters:</p>
        <div className="flex items-center mb-6 space-x-4">
          <Field>
            <Input
              placeholder="John Doe"
              autoCapitalize="off"
              autoComplete="off"
              className="h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Field>
          <Select items={RolesOptions} value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger className="h-10 py-4.75">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {RolesOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="h-10 px-8" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 font-semibold">User</TableHead>
            <TableHead className="w-10 font-semibold"></TableHead>
            <TableHead className="w-10 font-semibold px-8">Email</TableHead>
            <TableHead className="w-10 font-semibold px-8">Role</TableHead>
            <TableHead className="font-semibold">Course</TableHead>
            <TableHead className="w-10 font-semibold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center font-2xl font-bold py-10">
                No users found.
              </TableCell>
            </TableRow>
          )}
          {filteredUsers?.map((user) => (
            <TableRow className="h-18" key={user.id}>
              <TableCell>
                <UserImage imageURL={user.imageUrl} username={user.firstName} />
              </TableCell>
              <TableCell className="font-semibold">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="px-8">{user.email}</TableCell>
              <TableCell className="px-8">{user.role}</TableCell>
              <TableCell>
                {isCoursesLoading
                  ? 'Loading...'
                  : courses?.find((course) => course.id === user.courseId)?.name || 'N/A'}
              </TableCell>
              <TableCell>
                <CreateNewUserModal user={user} type="edit" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
