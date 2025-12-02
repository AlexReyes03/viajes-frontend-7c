import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

// Chart colors using design tokens
const CHART_COLORS = [
  '#0eafd8', // --color-cyan-tint-1
  '#a8bf30', // --color-lime-tint-1
  '#c25cff', // --color-purple-tint-1
  '#089b8f', // --color-teal-tint-1
  '#0084c4', // --color-blue-tint-1
  '#bf3030', // --color-red-tint-1
];

// Reusable pie chart component for admin dashboard
export default function AdminPieChart({
  data = [],
  height = 350,
  title = '',
  showLegend = true,
  enableArcLinkLabels = true,
  innerRadius = 0.5,
}) {
  // Memoize colors assignment to data
  const coloredData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [data]);

  // Check if there is data to display
  const hasData = coloredData.length > 0 && coloredData.some((item) => item.value > 0);

  if (!hasData) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div
            className="d-flex align-items-center justify-content-center text-muted"
            style={{ height }}
          >
            <span>Sin datos disponibles</span>
          </div>
          {title && <h5 className="text-center fw-semibold mt-2 mb-0">{title}</h5>}
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <div style={{ height }}>
          <ResponsivePie
            data={coloredData}
            colors={{ datum: 'data.color' }}
            margin={{ top: 20, right: 80, bottom: showLegend ? 80 : 20, left: 80 }}
            innerRadius={innerRadius}
            padAngle={2}
            cornerRadius={4}
            activeOuterRadiusOffset={8}
            borderWidth={0}
            enableArcLinkLabels={enableArcLinkLabels}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="#fff"
            legends={
              showLegend
                ? [
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 20,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#666',
                      itemDirection: 'left-to-right',
                      symbolSize: 14,
                      symbolShape: 'circle',
                    },
                  ]
                : []
            }
            motionConfig="gentle"
            tooltip={({ datum }) => (
              <div
                style={{
                  background: '#fff',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{datum.label || datum.id}</strong>: {datum.value.toLocaleString('es-MX')}
              </div>
            )}
          />
        </div>
        {title && <h5 className="text-center fw-semibold mt-2 mb-0">{title}</h5>}
      </div>
    </div>
  );
}

