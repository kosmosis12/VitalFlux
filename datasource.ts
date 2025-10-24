import * as DM from '../VitalFlux';

export function applyDataSourceOverride() {
  const override = import.meta.env.VITE_SISENSE_DATASOURCE_TITLE as string | undefined;
  if (!override) return;
  try {
    if (DM.DataSource && typeof DM.DataSource === 'object') {
      (DM.DataSource as any).title = override;
    }

    const patchNode = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if ('dataSource' in node && node.dataSource && typeof node.dataSource === 'object') {
        node.dataSource.title = override;
      }
      for (const k of Object.keys(node)) {
        const v = (node as any)[k];
        if (v && typeof v === 'object') patchNode(v);
      }
    };

    for (const key of Object.keys(DM) as Array<keyof typeof DM>) {
      const val = (DM as any)[key];
      if (val && typeof val === 'object') patchNode(val);
    }
    // eslint-disable-next-line no-console
    console.info(`[VitalFlux] Using data source: ${override}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[VitalFlux] Failed to apply data source override', e);
  }
}

