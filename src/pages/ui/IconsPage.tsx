import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  BgColorsOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloudOutlined,
  DashboardOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  FilterOutlined,
  FolderOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  App,
  Empty,
  Input,
  Pagination,
  Segmented,
  Skeleton,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { type ComponentType, type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';

// Canonical, never-translated labels shown in the view. Their translated
// equivalents are surfaced as tooltips instead (see TooltipLabel below).
const TAB_LABELS = { antd: 'Ant Design', huge: 'Huge Icons' } as const;
const SHAPE_LABELS = { round: 'Round', sharp: 'Sharp' } as const;
const VARIANT_LABELS = {
  solid: 'Solid',
  stroke: 'Stroke',
  duotone: 'Duotone',
  twotone: 'Twotone',
} as const;

/** Shape of the in-house "Huge Icons" components — that asset library isn't checked into the repo yet. */
interface IconProps {
  size?: number;
  className?: string;
}

type IconTab = keyof typeof TAB_LABELS;
type IconShape = keyof typeof SHAPE_LABELS;
type IconVariant = keyof typeof VARIANT_LABELS;

// Which variants each shape offers (per design spec). Variants without a folder
// on disk simply render an empty state until icons are added.
const SHAPE_VARIANTS: Record<IconShape, IconVariant[]> = {
  round: ['solid', 'stroke', 'duotone', 'twotone'],
  sharp: ['solid', 'stroke'],
};

// Maps a UI variant key to its on-disk folder name (note `duo-tone`).
const VARIANT_TO_FOLDER: Record<IconVariant, string> = {
  solid: 'solid',
  stroke: 'stroke',
  duotone: 'duo-tone',
  twotone: 'twotone',
};

const PAGE_SIZE = 48;

const tabParser = parseAsStringEnum<IconTab>(['antd', 'huge']).withDefault('antd');
const qParser = parseAsString.withDefault('');
const shapeParser = parseAsStringEnum<IconShape>(['round', 'sharp']).withDefault('round');
const variantParser = parseAsStringEnum<IconVariant>([
  'solid',
  'stroke',
  'duotone',
  'twotone',
]).withDefault('stroke');
const pageParser = parseAsInteger.withDefault(1);

/** Literal label in view, translated text as tooltip. */
function TooltipLabel({ label, tip }: { label: string; tip: string }) {
  return (
    <Tooltip title={tip}>
      <span>{label}</span>
    </Tooltip>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ant Design icons tab                                                      */
/* -------------------------------------------------------------------------- */

interface AntdEntry {
  name: string;
  Icon: ComponentType<{ style?: CSSProperties }>;
}

const ANTD_ICONS: AntdEntry[] = [
  { name: 'AppstoreOutlined', Icon: AppstoreOutlined },
  { name: 'BarChartOutlined', Icon: BarChartOutlined },
  { name: 'BellOutlined', Icon: BellOutlined },
  { name: 'BgColorsOutlined', Icon: BgColorsOutlined },
  { name: 'CalendarOutlined', Icon: CalendarOutlined },
  { name: 'CheckCircleOutlined', Icon: CheckCircleOutlined },
  { name: 'CloudOutlined', Icon: CloudOutlined },
  { name: 'DashboardOutlined', Icon: DashboardOutlined },
  { name: 'DeleteOutlined', Icon: DeleteOutlined },
  { name: 'DownloadOutlined', Icon: DownloadOutlined },
  { name: 'EditOutlined', Icon: EditOutlined },
  { name: 'FileOutlined', Icon: FileOutlined },
  { name: 'FilterOutlined', Icon: FilterOutlined },
  { name: 'FolderOutlined', Icon: FolderOutlined },
  { name: 'GlobalOutlined', Icon: GlobalOutlined },
  { name: 'HeartOutlined', Icon: HeartOutlined },
  { name: 'HomeOutlined', Icon: HomeOutlined },
  { name: 'InfoCircleOutlined', Icon: InfoCircleOutlined },
  { name: 'LockOutlined', Icon: LockOutlined },
  { name: 'LogoutOutlined', Icon: LogoutOutlined },
  { name: 'MailOutlined', Icon: MailOutlined },
  { name: 'MenuOutlined', Icon: MenuOutlined },
  { name: 'MessageOutlined', Icon: MessageOutlined },
  { name: 'PlusOutlined', Icon: PlusOutlined },
  { name: 'ReloadOutlined', Icon: ReloadOutlined },
  { name: 'SaveOutlined', Icon: SaveOutlined },
  { name: 'SearchOutlined', Icon: SearchOutlined },
  { name: 'SettingOutlined', Icon: SettingOutlined },
  { name: 'ShoppingCartOutlined', Icon: ShoppingCartOutlined },
  { name: 'StarOutlined', Icon: StarOutlined },
  { name: 'TeamOutlined', Icon: TeamOutlined },
  { name: 'ThunderboltOutlined', Icon: ThunderboltOutlined },
  { name: 'UploadOutlined', Icon: UploadOutlined },
  { name: 'UserOutlined', Icon: UserOutlined },
  { name: 'WarningOutlined', Icon: WarningOutlined },
];

interface IconCardProps {
  name: string;
  tip: string;
  onCopy: () => void;
  children: React.ReactNode;
}

function IconCard({ name, tip, onCopy, children }: IconCardProps) {
  return (
    <Tooltip title={tip}>
      <button
        type="button"
        onClick={onCopy}
        className="flex w-full flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4 text-foreground transition-colors hover:border-primary hover:bg-muted"
      >
        {children}
        <span className="block w-full truncate text-xs text-muted-foreground">{name}</span>
      </button>
    </Tooltip>
  );
}

function AntdIconsTab() {
  const { t } = useTranslation('ui');
  const { message } = App.useApp();
  const [search, setSearch] = useQueryState('q', qParser);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? ANTD_ICONS.filter((icon) => icon.name.toLowerCase().includes(query))
    : ANTD_ICONS;

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(`<${name} />`);
    message.success(`Copied <${name} />`);
  };

  return (
    <div>
      <Input
        allowClear
        prefix={<SearchOutlined className="text-muted-foreground" />}
        placeholder="Search icons..."
        value={search}
        onChange={(e) => void setSearch(e.target.value || null)}
        className="mb-6 max-w-xs"
      />
      {filtered.length === 0 ? (
        <Empty description={`No icons match "${search}"`} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map(({ name, Icon }) => (
            <IconCard
              key={name}
              name={name}
              tip={t('icons.copyHint', { name })}
              onCopy={() => void copy(name)}
            >
              <Icon style={{ fontSize: 28 }} />
            </IconCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Huge icons tab (shared/ui/all-icons)                                      */
/* -------------------------------------------------------------------------- */

type IconModule = Record<string, ComponentType<IconProps>>;

interface HugeEntry {
  name: string;
  shape: IconShape;
  folder: string;
  load: () => Promise<IconModule>;
}

// Lazily discover every icon. Vite turns each match into its own on-demand
// chunk, so only the icons actually rendered get fetched.
const importers = import.meta.glob<IconModule>('../../shared/ui/all-icons/*/*/*.tsx');
const PATH_RE = /all-icons\/(round|sharp)\/([a-z-]+)\/(.+)\.tsx$/;

const HUGE_ICONS: HugeEntry[] = Object.entries(importers)
  .map(([path, load]) => {
    const match = PATH_RE.exec(path.replace(/\\/g, '/'));
    if (!match) return null;
    const [, shape, folder, name] = match;
    // Skip the per-folder `withSvg` helper and stray "<Name> copy.tsx"
    // duplicates — neither is a real, importable icon.
    if (name.startsWith('withSvg') || name.endsWith(' copy')) return null;
    return { name, shape: shape as IconShape, folder, load };
  })
  .filter((entry): entry is HugeEntry => entry !== null)
  .sort((a, b) => a.name.localeCompare(b.name));

function LazyIcon({ entry }: { entry: HugeEntry }) {
  const [Icon, setIcon] = useState<ComponentType<IconProps> | null>(null);

  useEffect(() => {
    let active = true;
    void entry.load().then((mod) => {
      if (active) setIcon(() => mod[entry.name] ?? null);
    });
    return () => {
      active = false;
    };
  }, [entry]);

  if (!Icon) return <Skeleton.Avatar active size={28} shape="square" />;
  return <Icon size={28} />;
}

function HugeIconsTab() {
  const { t } = useTranslation('ui');
  const { message } = App.useApp();

  const [search, setSearch] = useQueryState('q', qParser);
  const [shape, setShape] = useQueryState('shape', shapeParser);
  const [variant, setVariant] = useQueryState('variant', variantParser);
  const [page, setPage] = useQueryState('page', pageParser);

  // Clamp to a variant the current shape actually offers.
  const variants = SHAPE_VARIANTS[shape];
  const activeVariant = variants.includes(variant) ? variant : 'stroke';
  const folder = VARIANT_TO_FOLDER[activeVariant];

  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      HUGE_ICONS.filter(
        (icon) =>
          icon.shape === shape &&
          icon.folder === folder &&
          (!query || icon.name.toLowerCase().includes(query)),
      ),
    [shape, folder, query],
  );

  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const copy = async (entry: HugeEntry) => {
    const snippet = `import { ${entry.name} } from '@/shared/ui/all-icons/${entry.shape}/${entry.folder}/${entry.name}';`;
    await navigator.clipboard.writeText(snippet);
    message.success(`Copied import for ${entry.name}`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-muted-foreground" />}
          placeholder="Search icons..."
          value={search}
          onChange={(e) => {
            void setSearch(e.target.value || null);
            void setPage(null);
          }}
          className="max-w-xs"
        />
        <Segmented
          value={shape}
          onChange={(value) => {
            void setShape(value as IconShape);
            void setPage(null);
          }}
          options={(Object.keys(SHAPE_LABELS) as IconShape[]).map((s) => ({
            value: s,
            label: <TooltipLabel label={SHAPE_LABELS[s]} tip={t(`icons.shape.${s}`)} />,
          }))}
        />
        <Segmented
          value={activeVariant}
          onChange={(value) => {
            void setVariant(value as IconVariant);
            void setPage(null);
          }}
          options={variants.map((v) => ({
            value: v,
            label: <TooltipLabel label={VARIANT_LABELS[v]} tip={t(`icons.variant.${v}`)} />,
          }))}
        />
        <Typography.Text className="text-muted-foreground">{filtered.length} icons</Typography.Text>
      </div>

      {filtered.length === 0 ? (
        <Empty
          description={query ? `No icons match "${search}"` : 'No icons in this variant yet'}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {visible.map((entry) => (
              <IconCard
                key={`${entry.shape}-${entry.folder}-${entry.name}`}
                name={entry.name}
                tip={t('icons.copyHint', { name: entry.name })}
                onCopy={() => void copy(entry)}
              >
                <LazyIcon entry={entry} />
              </IconCard>
            ))}
          </div>
          <Pagination
            className="mt-6 text-center"
            current={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            showSizeChanger={false}
            onChange={(next) => void setPage(next === 1 ? null : next)}
          />
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function IconsPage() {
  const { t } = useTranslation('ui');
  const [tab, setTab] = useQueryState('tab', tabParser);

  return (
    <div>
      <PageTitle title="Icons" />
      <Typography.Title level={4} className="mb-2! text-foreground">
        Icons
      </Typography.Title>
      <Typography.Paragraph className="text-muted-foreground">
        Browse Ant Design and the in-house Huge Icons library. Click any icon to copy its import.
      </Typography.Paragraph>

      <Tabs
        activeKey={tab}
        onChange={(key) => void setTab(key as IconTab)}
        items={[
          {
            key: 'antd',
            label: <TooltipLabel label={TAB_LABELS.antd} tip={t('icons.tabs.antd')} />,
            children: <AntdIconsTab />,
          },
          {
            key: 'huge',
            label: <TooltipLabel label={TAB_LABELS.huge} tip={t('icons.tabs.huge')} />,
            children: <HugeIconsTab />,
          },
        ]}
      />
    </div>
  );
}
