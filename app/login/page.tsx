import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login-form">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button form="login-form" formAction={login} className="w-full">
                        Iniciar Sesión
                    </Button>
                    <Button form="login-form" formAction={signup} variant="outline" className="w-full">
                        Registrarse
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
