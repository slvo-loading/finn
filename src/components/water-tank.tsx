export function WaterTank({ waterLevel, fullTank }: { waterLevel: number, fullTank: number }) {

    return (
        <div className="flex items-end h-full w-full rounded-sm border-1 p-1">
            <div className="w-full bg-sky-200 rounded-sm" style={{ height: `${(waterLevel/fullTank) * 100}%` }}>
            {/* put fish in here */}
            </div>
        </div>
    )
}
