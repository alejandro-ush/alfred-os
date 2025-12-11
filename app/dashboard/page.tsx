import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-foreground">
                        Bienvenido al Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-center text-muted-foreground">
                        Has iniciado sesión como:
                        <br />
                        <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                    <form action={signOut} className="w-full">
                        <Button variant="destructive" className="w-full" type="submit">
                            Cerrar Sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
