import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  accent?: string;
};

export default function StatsCard({ title, value, icon, accent }: StatsCardProps) {
  return (
    <Card
      sx={{
        minHeight: 132,
        background: `linear-gradient(135deg, ${accent ?? "#1f2937"} 0%, rgba(17,24,39,0.95) 70%)`,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <div>
            <Typography variant="body2" color="rgba(255,255,255,0.75)">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
              {value}
            </Typography>
          </div>
          {icon}
        </Stack>
      </CardContent>
    </Card>
  );
}
