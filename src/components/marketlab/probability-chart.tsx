"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYesChance } from "@/lib/markets/format";
import { filterSeriesByRange } from "@/lib/markets/probability";
import type { ProbabilitySeries } from "@/lib/markets/types";

type ChartRange = "7d" | "30d" | "all";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };

function buildPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${point.x} ${point.y}`;
    })
    .join(" ");
}

export function ProbabilityChart({
  series,
  currentYesChance,
}: {
  series: ProbabilitySeries;
  currentYesChance: number;
}) {
  const [range, setRange] = useState<ChartRange>("all");

  const filteredSeries = useMemo(
    () => filterSeriesByRange(series, range),
    [series, range],
  );

  const plot = useMemo(() => {
    const points = filteredSeries.points;
    const timestamps = points.map((point) =>
      new Date(point.timestamp).getTime(),
    );
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const timeSpan = Math.max(maxTime - minTime, 1);

    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const plotted = points.map((point) => {
      const time = new Date(point.timestamp).getTime();
      const x = PADDING.left + ((time - minTime) / timeSpan) * innerWidth;
      const y =
        PADDING.top +
        innerHeight -
        (Math.min(100, Math.max(0, point.yesChance)) / 100) * innerHeight;

      return { x, y, timestamp: point.timestamp };
    });

    return {
      path: buildPath(plotted),
      plotted,
      minTime,
      maxTime,
    };
  }, [filteredSeries.points]);

  return (
    <Card data-testid="probability-chart">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Probability</CardTitle>
            <CardDescription>{filteredSeries.label}</CardDescription>
          </div>
          <div
            className="text-2xl font-semibold"
            data-testid="current-yes-chance"
          >
            {formatYesChance(currentYesChance)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["7d", "30d", "all"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={range === value ? "default" : "outline"}
              onClick={() => setRange(value)}
            >
              {value === "all" ? "All" : value.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[320px] text-muted-foreground"
            role="img"
            aria-label={`${filteredSeries.label}: ${formatYesChance(currentYesChance)} Yes chance`}
            data-testid="probability-chart-svg"
          >
            <title>{filteredSeries.label}</title>
            {[0, 25, 50, 75, 100].map((tick) => {
              const y =
                PADDING.top +
                (CHART_HEIGHT - PADDING.top - PADDING.bottom) -
                (tick / 100) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);

              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    className="stroke-border"
                    strokeDasharray={tick === 50 ? "4 4" : "2 6"}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            <line
              x1={PADDING.left}
              x2={CHART_WIDTH - PADDING.right}
              y1={CHART_HEIGHT - PADDING.bottom}
              y2={CHART_HEIGHT - PADDING.bottom}
              className="stroke-border"
            />

            <path
              d={plot.path}
              fill="none"
              className="stroke-chart-1"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-testid="probability-chart-line"
            />

            {plot.plotted.map((point, index) => (
              <circle
                key={point.timestamp}
                cx={point.x}
                cy={point.y}
                r={index === plot.plotted.length - 1 ? 4 : 2.5}
                className="fill-chart-1"
              />
            ))}
          </svg>
        </div>

        {filteredSeries.mode === "flat" ? (
          <p className="text-sm text-muted-foreground">
            Showing current market balance/sentiment as a flat line because
            historical ledger data is not available yet.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
