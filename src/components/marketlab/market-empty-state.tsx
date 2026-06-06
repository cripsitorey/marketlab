import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketEmptyState() {
  return (
    <Card className="border-dashed" data-testid="market-empty-state">
      <CardHeader>
        <CardTitle>No markets yet</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <p>
          Markets will appear here once they are available in Supabase. Browse
          fictional Yes/No markets using fake money when they are ready.
        </p>
      </CardContent>
    </Card>
  );
}
