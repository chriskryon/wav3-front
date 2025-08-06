import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Wav3Loading from '../loading-wav3';

export function AssetsSection({ assetsTab, setAssetsTab, isAssetsLoading, filteredAssets, renderAssetIcon }: any) {
  return (
    <Card className="glass-card-enhanced border border-wav3 px-4 py-3 rounded-xl shadow-md backdrop-blur-md">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-main">Assets</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-72 scroll-area px-4 pb-4 pt-1">
        <Tabs value={assetsTab} onValueChange={(v) => setAssetsTab(v as 'all' | 'crypto' | 'fiat')} className="w-full mb-2">
          <TabsList className="glass-tabs mb-1 p-0.5 gap-1">
            <TabsTrigger value="all" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">All</TabsTrigger>
            <TabsTrigger value="crypto" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">Crypto</TabsTrigger>
            <TabsTrigger value="fiat" className="glass-tab-trigger text-xs px-2 py-1 min-w-[48px]">Fiat</TabsTrigger>
          </TabsList>
        </Tabs>
        {isAssetsLoading ? (
          <Wav3Loading />
        ) : filteredAssets.length === 0 ? (
          <div className="text-center text-muted text-xs">No assets found.</div>
        ) : (
          filteredAssets.map((asset: any) => (
            <div
              key={asset.id}
              className="glass-item flex items-center gap-4 border border-wav3/30 px-4 py-3 rounded-lg mb-2 shadow-md backdrop-blur-md hover:shadow-lg transition-shadow duration-300"
            >
              {renderAssetIcon(asset.symbol, asset.small_image_url, 'background')}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-main text-sm truncate">
                  {asset.name} <span className="text-xs text-muted">({asset.symbol})</span>
                </div>
                <div className="text-xs muted-text truncate">
                  {(asset.networks || []).map((n: any) => n.name).join(', ')}
                </div>
              </div>
              <Badge
                variant="outline"
                className="glass-badge text-xs px-3 py-1 bg-primary/10 text-primary border-primary/30 rounded-full"
              >
                {asset.type}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
