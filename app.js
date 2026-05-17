const icons = {
  horizontal:
    '<svg viewBox="0 0 24 24"><path d="M4 12h16"/><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/></svg>',
  vertical:
    '<svg viewBox="0 0 24 24"><path d="M12 4v16"/><path d="m8 8 4-4 4 4"/><path d="m8 16 4 4 4-4"/></svg>',
  path:
    '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h3a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4"/></svg>',
  agent:
    '<svg viewBox="0 0 24 24"><path d="M12 4v3"/><rect x="6" y="7" width="12" height="10" rx="3"/><path d="M9 17v3"/><path d="M15 17v3"/><path d="M8 11h.01"/><path d="M16 11h.01"/><path d="M9 14h6"/></svg>',
  data:
    '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  schema:
    '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M11 7.5h2"/><path d="M7.5 11v2"/><path d="M11 16.5h5.5a2 2 0 0 0 2-2V11"/></svg>',
};

const navItems = [
  { key: "horizontal", label: "横坐标库", icon: icons.horizontal },
  { key: "vertical", label: "纵坐标库", icon: icons.vertical },
  { key: "paths", label: "Path管理", icon: icons.path },
  { key: "agents", label: "AI Agent接入管理", icon: icons.agent },
  { key: "sources", label: "数据源接入管理", icon: icons.data },
  { key: "spec", label: "实体关系图 / Spec", icon: icons.schema },
];

const APP_VERSION = "0.1 alpha";
const BACKEND_BOOTSTRAP_URL = "/api/bootstrap";

const horizontalEntries = [];

const horizontalDefinitionSchema = [
  ["id", "横坐标定义唯一 ID，例如 hc_friday_1500_liquidation。"],
  ["name", "横坐标名称，给人看的短标签。"],
  ["category", "大类：周内、日内、月度、事件、跨市场、节假日。"],
  ["coordinate_type", "时间点、时间窗口、事件相对时间、阶段、lead_lag。"],
  ["definition", "精确定义，说明它到底描述哪个时间/事件结构。"],
  ["original_time_text", "赵哥或来源里的原始说法，例如 18:30、周五 3:30、财报后三天。"],
  ["time_basis", "原始时间口径：UTC+8、ET、local_market、relative。"],
  ["timezone", "规范时区：Asia/Shanghai、America/New_York、event_timezone。"],
  ["dst_policy", "夏令时处理：固定东八区、跟随美股、跟随事件公告。"],
  ["anchor", "锚点：开盘、收盘、财报发布时间、FOMC、周末、BTC 波动等。"],
  ["start_rule", "开始规则，例如 Friday 15:00 ET 或 event_time - 10m。"],
  ["end_rule", "结束规则，例如 Friday 15:30 ET 或 event_time。"],
  ["known_at_rule", "当时是否已知，用来防未来函数。"],
  ["recurrence", "发生频率：每日、每周、每月、事件驱动、不规则。"],
  ["market_scope", "适用市场：美股、BTC、A股、港股、全球宏观。"],
  ["symbol_scope", "适用标的或股票池：SPY/QQQ、明星股、币股、慢性股。"],
  ["flow_tags", "可能关联的资金状态：强平、回补、被动减持、风险重定价。"],
  ["linked_vertical_types", "常生成或关联的纵坐标类型。"],
  ["data_requirements", "运行它需要哪些数据。"],
  ["check_frequency", "实时检查频率或事件触发方式。"],
  ["evidence_count", "证据数量。"],
  ["confidence", "候选、常见、高频、已验证。"],
  ["status", "候选、启用、待验证、废弃。"],
  ["notes", "补充说明。"],
];

const horizontalOccurrenceSchema = [
  ["occurrence_id", "横坐标实例唯一 ID。"],
  ["coordinate_id", "对应 horizontal_coordinate.id。"],
  ["trade_date", "交易日或事件归属窗口；原型页只使用周一、周五、事件日等框架语言。"],
  ["start_at_local", "按原始口径保存的本地开始时间。"],
  ["end_at_local", "按原始口径保存的本地结束时间。"],
  ["start_at_utc", "换算后的 UTC 开始时间框架；原型页不填具体日期。"],
  ["end_at_utc", "换算后的 UTC 结束时间框架；原型页不填具体日期。"],
  ["known_at_utc", "当时最早可知道这个实例的时间框架。"],
  ["activation_state", "scheduled、active、closed、cancelled。"],
  ["observed_context", "当时上下文，例如 BTC 破位、财报已发布、周五结算。"],
  ["generated_vertical_ids", "该实例生成或关联的纵坐标 ID。"],
  ["path_ids", "参与的 path ID。"],
];

const horizontalDefinitionRows = [
  {
    id: "hc_tsll_pre_entry_ab_measure_window",
    name: "TSLL A/B测量窗口",
    category: "日内",
    coordinate_type: "时间窗口",
    definition: "美股常规交易日尾盘，从 14:35 ET 开始到 15:00 ET 首笔入场前，用 TSLL 逐笔成交提取 A/B/C 价格结构。",
    original_time_text: "14:35-15:00 ET before first entry tick",
    time_basis: "ET",
    timezone: "America/New_York",
    dst_policy: "跟随美股夏令时/冬令时",
    anchor: "regular_session_close - power_hour",
    start_rule: "regular_session 14:35 ET",
    end_rule: "first TSLL trade at or after 15:00 ET",
    known_at_rule: "只使用 15:00 ET 入场前已经发生的逐笔成交；不得使用入场后的高低点。",
    recurrence: "每个美股常规交易日",
    market_scope: "US equities",
    symbol_scope: "TSLL",
    flow_tags: "尾盘抛压, 杠杆ETF, 回补, liquidity_reclaim",
    linked_vertical_types: "vc_tsll_ab_a_pre_entry_high, vc_tsll_ab_b_entry_price, vc_tsll_ab_c_pre_entry_low, vc_tsll_ab_gap_filter, vc_tsll_ab_reclaim_tp_sl",
    data_requirements: "TSLL tick trades from 14:35 ET through first tick after 15:00 ET",
    check_frequency: "tick during 14:35-15:00 ET",
    evidence_count: "power_hour_lab aggregate: 209 A/B trades after skip filter",
    confidence: "已回测候选",
    status: "review",
    notes: "来源 /tmp/bc_power_hour_web/analysis.json；用于计算 A/B/C 和动态回补目标。",
  },
  {
    id: "hc_tsll_power_hour_1450_window",
    name: "TSLL 14:50尾盘窗口",
    category: "日内",
    coordinate_type: "时间窗口",
    definition: "TSLL 尾盘 14:50-15:00 ET 观察窗口，窗口末分钟收完后生成固定窗口信号。",
    original_time_text: "14:50-15:00 ET",
    time_basis: "ET",
    timezone: "America/New_York",
    dst_policy: "跟随美股夏令时/冬令时",
    anchor: "regular_session_close - power_hour",
    start_rule: "regular_session 14:50 ET",
    end_rule: "regular_session 15:00 ET",
    known_at_rule: "14:59 这一根 1m bar 收完后才可确认，不早于 15:00 ET 入场。",
    recurrence: "每个美股常规交易日",
    market_scope: "US equities",
    symbol_scope: "TSLL",
    flow_tags: "尾盘抛压, 强平, 回补, reversal",
    linked_vertical_types: "vc_tsll_ab_b_entry_price, vc_tsll_ab_reclaim_tp_sl",
    data_requirements: "TSLL 1m bars, TSLL tick trades",
    check_frequency: "1m during 14:50-15:00 ET",
    evidence_count: "power_hour_lab fixed_end sample around 244 trades",
    confidence: "已回测候选",
    status: "review",
    notes: "固定窗口末分钟规则：窗口最后一分钟收完，下一分钟按逐笔成交入场。",
  },
  {
    id: "hc_tsll_entry_first_tick_1500",
    name: "TSLL 15:00首笔入场点",
    category: "日内",
    coordinate_type: "时间点",
    definition: "15:00 ET 到达后 TSLL 的第一笔可用逐笔成交，作为 B 价格和回补 Path 的入场锚点。",
    original_time_text: "15:00 first tick ET",
    time_basis: "ET",
    timezone: "America/New_York",
    dst_policy: "跟随美股夏令时/冬令时",
    anchor: "regular_session 15:00 ET",
    start_rule: "first TSLL trade timestamp >= 15:00 ET",
    end_rule: "same tick",
    known_at_rule: "该 tick 到达后立即已知；B 价格取该 tick 成交价。",
    recurrence: "每个美股常规交易日",
    market_scope: "US equities",
    symbol_scope: "TSLL",
    flow_tags: "entry_anchor, liquidity_reclaim",
    linked_vertical_types: "vc_tsll_ab_b_entry_price, vc_tsll_ab_gap_filter, vc_tsll_ab_reclaim_tp_sl",
    data_requirements: "TSLL tick trades",
    check_frequency: "tick after 15:00 ET",
    evidence_count: "power_hour_lab A/B reclaim rows",
    confidence: "已回测候选",
    status: "review",
    notes: "这是入场坐标，不代表交易建议；后续由验证/人工复核决定是否启用。",
  },
];

const horizontalOccurrenceRows = [];

const verticalEntries = [];

const verticalDefinitionSchema = [
  ["id", "纵坐标定义唯一 ID，例如 vc_second_handshake_low。"],
  ["name", "纵坐标名称，给人看的短标签。"],
  ["category", "大类：低点、减仓、缺口、事件、期权、跨市场、机构成本。"],
  ["coordinate_type", "低点、高点、区间、阈值、比例价、指标值、阶梯价。"],
  ["price_domain", "价格域：stock_price、option_premium、iv、crypto_price、volume、index_level。"],
  ["definition", "精确定义，说明这个价格结构怎么识别。"],
  ["computation_method", "计算方式，例如 first_low_retest、event_midpoint、base_price * 0.98。"],
  ["source_window_rule", "从哪个时间窗口取价格，例如第一低点后半小时、财报后 3 天、15:00-15:30 ET。"],
  ["required_horizontal_ids", "依赖哪些横坐标定义或实例。"],
  ["symbol_scope", "适用标的或股票池。"],
  ["market_scope", "适用市场。"],
  ["input_data", "需要的输入数据：分钟线、盘前、期权、IV、BTC websocket、公告。"],
  ["value_unit", "数值单位：price、percent、premium、iv、volume。"],
  ["valid_from_rule", "从什么时候开始有效。"],
  ["valid_until_rule", "有效到什么时候或哪个事件前。"],
  ["invalidated_by", "被什么价格行为或事件击穿后失效。"],
  ["flow_tags", "可能关联的资金状态。"],
  ["evidence_count", "证据数量。"],
  ["confidence", "候选、常见、高频、已验证。"],
  ["status", "候选、启用、待验证、废弃。"],
  ["notes", "补充说明。"],
];

const verticalOccurrenceSchema = [
  ["occurrence_id", "纵坐标实例唯一 ID。"],
  ["coordinate_id", "对应 vertical_coordinate.id。"],
  ["symbol", "具体标的，例如 SPY、QQQ、TSLA、BTCUSDT、某期权合约。"],
  ["trade_date", "交易日或事件归属窗口；原型页只使用周五、盘前、事件日等框架语言。"],
  ["value", "具体数值，可以是价格、权利金、IV、成交额或百分比。"],
  ["value_unit", "数值单位：price、percent、premium、iv、volume。"],
  ["currency", "USD、USDT、CNY 或 null。"],
  ["source_window_start_utc", "提取该价格窗口的 UTC 开始时间框架；原型页不填具体日期。"],
  ["source_window_end_utc", "提取该价格窗口的 UTC 结束时间框架；原型页不填具体日期。"],
  ["computed_at_utc", "这个纵坐标被计算或确认的时间框架。"],
  ["horizontal_occurrence_ids", "关联的横坐标实例 ID。"],
  ["data_source", "行情、期权、OCR、网页总结、人工标注等来源。"],
  ["observed_context", "生成该价格时的上下文。"],
  ["valid_until_utc", "该价格实例有效到哪个框架窗口。"],
  ["invalidation_state", "active、invalidated、expired、unknown。"],
  ["invalidated_at_utc", "失效时间，没有则为空。"],
  ["path_ids", "参与的 path ID。"],
  ["evidence_ids", "关联证据 ID。"],
];

const verticalDefinitionRows = [
  {
    id: "vc_tsll_ab_a_pre_entry_high",
    name: "TSLL A价",
    category: "高点",
    coordinate_type: "高点",
    price_domain: "stock_price",
    definition: "A 价：TSLL 在 14:35 ET 到 15:00 后首笔入场前的逐笔成交最高价。",
    computation_method: "max(trade_price) over hc_tsll_pre_entry_ab_measure_window",
    source_window_rule: "hc_tsll_pre_entry_ab_measure_window",
    required_horizontal_ids: "hc_tsll_pre_entry_ab_measure_window",
    symbol_scope: "TSLL",
    market_scope: "US equities",
    input_data: "TSLL tick trades",
    value_unit: "price",
    valid_from_rule: "15:00 ET first tick known",
    valid_until_rule: "same trading session close or path invalidation",
    invalidated_by: "missing tick data, market halt, split/adjustment mismatch",
    flow_tags: "pre_entry_high, reclaim_reference",
    evidence_count: "power_hour_lab A/B reclaim",
    confidence: "已回测候选",
    status: "review",
    notes: "用于计算 A/B gap；A 比 B 高 1% 及以上时跳过。",
  },
  {
    id: "vc_tsll_ab_b_entry_price",
    name: "TSLL B价",
    category: "入场价",
    coordinate_type: "价格点",
    price_domain: "stock_price",
    definition: "B 价：15:00 ET 到达后 TSLL 第一笔逐笔成交价，也是 A/B 回补 Path 的入场锚点。",
    computation_method: "first_trade_price(timestamp >= 15:00 ET)",
    source_window_rule: "hc_tsll_entry_first_tick_1500",
    required_horizontal_ids: "hc_tsll_entry_first_tick_1500",
    symbol_scope: "TSLL",
    market_scope: "US equities",
    input_data: "TSLL tick trades",
    value_unit: "price",
    valid_from_rule: "first tick after 15:00 ET",
    valid_until_rule: "path exit or same trading session close",
    invalidated_by: "no first tick, abnormal halt, stale quote",
    flow_tags: "entry_anchor, reclaim_reference",
    evidence_count: "power_hour_lab A/B reclaim",
    confidence: "已回测候选",
    status: "review",
    notes: "B 是所有 A/B gap、TP、SL 的基准价。",
  },
  {
    id: "vc_tsll_ab_c_pre_entry_low",
    name: "TSLL C价",
    category: "低点",
    coordinate_type: "低点",
    price_domain: "stock_price",
    definition: "C 价：TSLL 在 14:35 ET 到 15:00 后首笔入场前的逐笔成交最低价。",
    computation_method: "min(trade_price) over hc_tsll_pre_entry_ab_measure_window",
    source_window_rule: "hc_tsll_pre_entry_ab_measure_window",
    required_horizontal_ids: "hc_tsll_pre_entry_ab_measure_window",
    symbol_scope: "TSLL",
    market_scope: "US equities",
    input_data: "TSLL tick trades",
    value_unit: "price",
    valid_from_rule: "15:00 ET first tick known",
    valid_until_rule: "same trading session close or path invalidation",
    invalidated_by: "missing tick data, market halt, split/adjustment mismatch",
    flow_tags: "pre_entry_low, v_shape_reference",
    evidence_count: "power_hour_lab A/B reclaim",
    confidence: "已回测候选",
    status: "review",
    notes: "C 用来描述 V 的下沿和 x/y 结构，不直接决定是否入场。",
  },
  {
    id: "vc_tsll_ab_gap_filter",
    name: "TSLL A/B跳过阈值",
    category: "阈值",
    coordinate_type: "比例价",
    price_domain: "percent",
    definition: "A/B gap = A / B - 1。若 A 比 B 高 1% 及以上，认为回补空间太远或追价风险过高，Path 直接跳过。",
    computation_method: "A / B - 1, using vc_tsll_ab_a_pre_entry_high and vc_tsll_ab_b_entry_price",
    source_window_rule: "hc_tsll_pre_entry_ab_measure_window + hc_tsll_entry_first_tick_1500",
    required_horizontal_ids: "hc_tsll_pre_entry_ab_measure_window, hc_tsll_entry_first_tick_1500",
    symbol_scope: "TSLL",
    market_scope: "US equities",
    input_data: "TSLL tick trades",
    value_unit: "percent",
    valid_from_rule: "15:00 ET first tick known",
    valid_until_rule: "entry decision only",
    invalidated_by: "A/B gap >= 1%, missing A or B",
    flow_tags: "skip_filter, chase_risk_control",
    evidence_count: "A/B sweep skipped 36 vs fixed baseline",
    confidence: "已回测候选",
    status: "review",
    notes: "这是过滤纵坐标：不是目标价，而是判断这次 V 是否值得进入的元价格。",
  },
  {
    id: "vc_tsll_ab_reclaim_tp_sl",
    name: "TSLL A/B回补目标",
    category: "目标价",
    coordinate_type: "阶梯价",
    price_domain: "stock_price",
    definition: "A/B 回补退出价格：A/B gap 小于 1% 时做多 TSLL，并用 A/B 结构动态设 TP；主版本用 0.75% SL，1.00% SL 为高胜率对照。",
    computation_method: "if A/B gap >= 1% skip; else TP = min(A-B gap, 0.75%) - 0.01 percentage point when A>B, otherwise 0.74%; SL primary = 0.75%",
    source_window_rule: "hc_tsll_pre_entry_ab_measure_window + hc_tsll_entry_first_tick_1500",
    required_horizontal_ids: "hc_tsll_pre_entry_ab_measure_window, hc_tsll_entry_first_tick_1500",
    symbol_scope: "TSLL",
    market_scope: "US equities",
    input_data: "TSLL tick trades",
    value_unit: "price",
    valid_from_rule: "after B price and A/B gap confirmed",
    valid_until_rule: "TP/SL hit, manual timeout, or regular session close",
    invalidated_by: "A/B gap >= 1%, SL hit, halt/news discontinuity",
    flow_tags: "reclaim_target, v_reversal, risk_box",
    evidence_count: "A/B SL0.75: n=209, win=72.25%, avg=0.066%; SL1.00: win=74.64%",
    confidence: "已回测候选",
    status: "review",
    notes: "回测结果仍需外样本验证；当前先作为 Path 定义，不生成具体交易日实例。",
  },
];

const verticalOccurrenceRows = [];

const pathDefinitionSchema = [
  ["id", "Path 定义唯一 ID。"],
  ["name", "Path 名称，给人看的短标签。"],
  ["path_family", "大类：周内、日内、事件、跨市场、期权。"],
  ["version", "定义版本，便于后续迭代和回滚。"],
  ["status", "draft、active、review、deprecated。"],
  ["description", "Path 的核心解释。"],
  ["node_sequence", "由哪些 path node/box 按顺序串起来。"],
  ["edge_rules", "节点之间的转移条件。"],
  ["horizontal_definition_ids", "引用的横坐标定义 ID。"],
  ["vertical_definition_ids", "引用的纵坐标定义 ID。"],
  ["flow_hypothesis", "大资金状态假设。"],
  ["entry_observation_rule", "进入观察状态的条件，不等于下单规则。"],
  ["invalidation_rule", "失效或切换条件。"],
  ["evaluation_plan", "触发后如何验证，例如 30m、1h、收盘、次日。"],
  ["symbol_scope", "适用标的或股票池。"],
  ["time_scope", "适用时间范围。"],
  ["required_data", "需要的数据源。"],
  ["discovered_by", "发现/提出/入库来源：AI Agent、用户、Codex、外部交易员或人工整理。"],
  ["owner_agent", "主要维护或生成它的 Agent。"],
  ["evidence_count", "证据数量。"],
  ["confidence", "候选、待验证、已验证。"],
  ["notes", "补充说明。"],
];

const pathInstanceSchema = [
  ["instance_id", "Path 实例唯一 ID。"],
  ["path_definition_id", "对应 path_definition.id。"],
  ["symbols", "本次实例涉及的标的集合。"],
  ["trade_date", "交易日或事件归属窗口；原型页只使用周内、周五、实时等框架语言。"],
  ["started_at_utc", "Path 实例开始时间框架；真实回放库再填具体 UTC。"],
  ["ended_at_utc", "Path 实例结束时间框架；真实回放库再填具体 UTC。"],
  ["activation_state", "watching、active、confirmed、failed、expired。"],
  ["current_node_id", "当前走到哪个 path node。"],
  ["horizontal_occurrence_ids", "触发的横坐标实例。"],
  ["vertical_occurrence_ids", "触发或生成的纵坐标实例。"],
  ["observed_node_sequence", "实盘实际走过的节点序列。"],
  ["outcome_label", "结果标签，例如 continuation、reversal、failed_breakdown。"],
  ["return_30m", "触发后 30 分钟收益。"],
  ["return_1h", "触发后 1 小时收益。"],
  ["return_close", "触发到收盘收益。"],
  ["mfe", "最大有利波动。"],
  ["mae", "最大不利波动。"],
  ["invalidated_at_utc", "失效时间。"],
  ["human_review_state", "人工审核状态。"],
  ["evidence_ids", "关联证据 ID。"],
  ["notes", "复盘备注。"],
];

const pathDefinitionRows = [
  {
    id: "path_tsll_power_hour_ab_reclaim_v",
    name: "TSLL尾盘A/B回补抓V",
    path_family: "日内 / power_hour / 杠杆ETF",
    version: "0.1",
    status: "review",
    description: "美股尾盘 14:50-15:00 ET 固定窗口确认后，以 15:00 后 TSLL 首笔成交为 B 价，结合 14:35-15:00 的 A/B/C 结构过滤追价风险并设置回补目标。",
    node_sequence: "pre_entry_ab_map -> power_hour_1450_window -> first_tick_entry_1500 -> ab_gap_filter -> ab_reclaim_exit",
    edge_rules: "14:35 开始取 A/C；14:59 bar 收完后等待 15:00 首笔 B；若 A/B gap >= 1% 则跳过；否则进入回补观察，用 A/B 动态 TP 和 SL 管理。",
    horizontal_definition_ids: "hc_tsll_pre_entry_ab_measure_window, hc_tsll_power_hour_1450_window, hc_tsll_entry_first_tick_1500",
    vertical_definition_ids: "vc_tsll_ab_a_pre_entry_high, vc_tsll_ab_b_entry_price, vc_tsll_ab_c_pre_entry_low, vc_tsll_ab_gap_filter, vc_tsll_ab_reclaim_tp_sl",
    flow_hypothesis: "尾盘 TSLL 的杠杆ETF流动性、被动抛压或短线强平可能造成 15:00 附近的短期错位；A/B 结构用于避免追太远，只捕捉可回补的 V 型空间。",
    entry_observation_rule: "每个美股常规交易日 14:50 ET 开始观察 TSLL；15:00 后首笔成交出现且 A/B gap < 1% 时，Path 进入 active 候选状态。",
    invalidation_rule: "A/B gap >= 1%；缺少 TSLL tick；15:00 附近停牌/异常跳价；SL 触发；TSLA/大盘突发事件改变尾盘流动性结构。",
    evaluation_plan: "继续做 no-lookahead 回测：按 30m、1h、收盘、TP/SL、timeout 分层验证；固定分割训练/测试，单独比较 SL0.75、SL1.00 和固定 TP/SL。",
    symbol_scope: "TSLL",
    time_scope: "美股常规交易日 14:35-16:00 ET，跟随纽约夏令时/冬令时",
    required_data: "TSLL 1m bars, TSLL tick trades, optional TSLA/SPY context",
    discovered_by: "手动：用户在 power_hour 项目发现，Codex 根据本地回测整理入库",
    owner_agent: "agent_path_validator",
    evidence_count: "power_hour_lab: A/B SL0.75 n=209; SL1.00 n=209; fixed baseline about n=244",
    confidence: "已回测候选",
    notes: "当前只入定义，不入具体日期实例。A/B SL0.75 回测 win=72.25%, avg=0.066%；SL1.00 win=74.64%, avg=0.053%；固定 TP/SL + m2_range_min avg 更高但样本更少，可作为后续子 Path。",
  },
];

const pathInstanceRows = [];

const pathCanvasDefinitions = [
  {
    id: "node_tsll_ab_map",
    seq: "01",
    title: "A/B测量",
    meta: "14:35-15:00 ET",
    detail: "用 15:00 入场前的 TSLL 逐笔成交生成 A 价、C 价，并为后续 A/B gap 判断提供上下边界。",
    kind: "event",
    x: 36,
    y: 96,
    horizontalIds: "hc_tsll_pre_entry_ab_measure_window",
    verticalIds: "vc_tsll_ab_a_pre_entry_high, vc_tsll_ab_c_pre_entry_low",
  },
  {
    id: "node_tsll_1450_window",
    seq: "02",
    title: "尾盘窗口",
    meta: "14:50-15:00 ET",
    detail: "固定窗口末分钟收完后形成观察信号。该节点只使用窗口内已完成数据，避免未来函数。",
    kind: "flow",
    x: 274,
    y: 96,
    horizontalIds: "hc_tsll_power_hour_1450_window",
  },
  {
    id: "node_tsll_1500_entry",
    seq: "03",
    title: "首笔B价",
    meta: "15:00 first tick",
    detail: "15:00 ET 后 TSLL 第一笔逐笔成交价作为 B 价，也是这条 Path 的入场锚点。",
    kind: "active",
    x: 512,
    y: 96,
    horizontalIds: "hc_tsll_entry_first_tick_1500",
    verticalIds: "vc_tsll_ab_b_entry_price",
  },
  {
    id: "node_tsll_ab_filter",
    seq: "04",
    title: "A/B过滤",
    meta: "gap < 1%",
    detail: "若 A 比 B 高 1% 及以上，说明回补目标太远或追价风险过大，直接跳过该次 Path。",
    kind: "watching",
    x: 512,
    y: 248,
    verticalIds: "vc_tsll_ab_gap_filter",
  },
  {
    id: "node_tsll_reclaim_exit",
    seq: "05",
    title: "回补退出",
    meta: "TP/SL",
    detail: "通过 A/B 结构设置动态回补目标；当前主版本记录 SL0.75，SL1.00 作为高胜率对照。",
    kind: "terminal",
    x: 750,
    y: 248,
    verticalIds: "vc_tsll_ab_reclaim_tp_sl",
  },
];

const pathCanvasDefinitionEdges = [
  { from: "node_tsll_ab_map", to: "node_tsll_1450_window", label: "进入尾盘" },
  { from: "node_tsll_1450_window", to: "node_tsll_1500_entry", label: "窗口确认" },
  { from: "node_tsll_1500_entry", to: "node_tsll_ab_filter", label: "计算gap" },
  { from: "node_tsll_ab_filter", to: "node_tsll_reclaim_exit", label: "未跳过" },
];

const pathCanvasInstances = [];

const pathCanvasInstanceEdges = [];

const agents = [
  {
    name: "言论监听 Agent",
    role: "从 Whop、Discord、网页总结、截图 OCR 中提取横坐标、纵坐标和资金假设。",
    input: "原始文本、截图、说话人、时间、来源链接",
    output: "结构化 coordinate_event 候选",
    status: "待接入",
  },
  {
    name: "历史挖掘 Agent",
    role: "从历史行情、事件日历和历史总结里寻找高频坐标与候选 path。",
    input: "分钟线、日线、事件、期权、总结文本",
    output: "新坐标、候选 path、样本数、初步胜率",
    status: "待接入",
  },
  {
    name: "市场状态 Agent",
    role: "实时判断当前在哪个时间节点、哪些纵坐标已触发、哪些 path 延迟或失效。",
    input: "SPY/QQQ、明星股、币股、BTC、黄金、原油、VIX",
    output: "active box、触发坐标、下一检查点",
    status: "待接入",
  },
  {
    name: "验证 Agent",
    role: "专门检查 no-lookahead、未来函数、触发后收益、触达率和失效条件。",
    input: "path 候选、历史行情、当时已知事件",
    output: "验证报告、置信度、适用市场环境",
    status: "待接入",
  },
  {
    name: "策展 Agent",
    role: "把重复、冲突、低证据坐标合并或降级，维持武器库干净。",
    input: "坐标库、path 库、验证结果、交易员反馈",
    output: "入库/合并/淘汰建议",
    status: "待接入",
  },
];

const llmApiDefinitionSchema = [
  ["id", "大模型 API 接入定义唯一 ID。"],
  ["provider", "模型供应商；当前只使用 Alibaba Cloud Bailian。"],
  ["model_name", "百炼控制台里的模型名，例如 qwen3.6-plus、qwen3.6-flash。"],
  ["model_family", "模型家族；当前统一为 qwen3.6。"],
  ["api_protocol", "百炼 API 接入协议；当前按 OpenAI-compatible 适配。"],
  ["api_base_ref", "API base 的配置引用，不在页面写敏感值。"],
  ["auth_method", "鉴权方式，例如 bearer_api_key。"],
  ["credential_ref", "密钥引用，例如 env:BAILIAN_API_KEY，绝不展示明文 token。"],
  ["context_window", "上下文长度或配置档位。"],
  ["modalities", "输入/输出模态：text、image、json、tool 等。"],
  ["tool_calling", "是否支持工具调用或 function calling。"],
  ["json_mode", "是否支持结构化 JSON 输出。"],
  ["streaming", "是否支持流式输出。"],
  ["default_temperature", "默认温度。"],
  ["max_output_tokens", "默认最大输出长度。"],
  ["timeout_ms", "请求超时时间。"],
  ["rate_limit_policy", "限速和退避策略。"],
  ["cost_tier", "成本分层。"],
  ["status", "planned、active、paused、deprecated。"],
  ["notes", "补充说明。"],
];

const aiAgentInstanceSchema = [
  ["agent_id", "Agent 实例唯一 ID。"],
  ["name", "Agent 名称。"],
  ["role_type", "角色类型：listener、miner、state_monitor、path_generator、validator、curator。"],
  ["llm_definition_id", "绑定哪个 llm_api_definition。"],
  ["prompt_id", "绑定的 prompt 模板 ID。"],
  ["prompt_version", "prompt 版本。"],
  ["workflow_type", "workflow 形态：n8n、local_harness、cron、websocket、manual。"],
  ["workflow_ref", "workflow 引用，例如 n8n workflow 名或本地 harness 名。"],
  ["trigger_type", "触发方式：schedule、webhook、stream、manual。"],
  ["schedule_rule", "定时规则或触发说明。"],
  ["input_sources", "输入数据源。"],
  ["output_targets", "输出目标。"],
  ["write_scope", "允许写入的表或队列。"],
  ["guardrails", "约束：证据必填、只入待审、禁止交易指令等。"],
  ["review_policy", "人工审核策略。"],
  ["telemetry", "运行指标和日志要求。"],
  ["status", "planned、active、paused、failed。"],
  ["last_run_at", "最近运行时间。"],
  ["notes", "补充说明。"],
];

const llmApiDefinitionRows = [
  {
    id: "llm_bailian_qwen36_plus",
    provider: "Alibaba Cloud Bailian",
    model_name: "qwen3.6-plus",
    model_family: "qwen3.6",
    api_protocol: "OpenAI-compatible via Bailian",
    api_base_ref: "config:BAILIAN_API_BASE",
    auth_method: "bearer_api_key",
    credential_ref: "env:BAILIAN_API_KEY",
    context_window: "provider_configured",
    modalities: "text,json",
    tool_calling: "optional",
    json_mode: "required",
    streaming: "optional",
    default_temperature: "0.2",
    max_output_tokens: "2400",
    timeout_ms: "45000",
    rate_limit_policy: "queue + exponential_backoff",
    cost_tier: "primary_reasoning",
    status: "active",
    notes: "主力模型：复杂坐标抽取、Path 生成、反证验证、知识库整理。页面只保存密钥引用。",
  },
  {
    id: "llm_bailian_qwen36_flash",
    provider: "Alibaba Cloud Bailian",
    model_name: "qwen3.6-flash",
    model_family: "qwen3.6",
    api_protocol: "OpenAI-compatible via Bailian",
    api_base_ref: "config:BAILIAN_API_BASE",
    auth_method: "bearer_api_key",
    credential_ref: "env:BAILIAN_API_KEY",
    context_window: "provider_configured",
    modalities: "text,json",
    tool_calling: "optional",
    json_mode: "required",
    streaming: "yes",
    default_temperature: "0.1",
    max_output_tokens: "1200",
    timeout_ms: "20000",
    rate_limit_policy: "high_frequency_queue + fallback_to_plus",
    cost_tier: "fast_filter",
    status: "active",
    notes: "高频模型：实时消息初筛、去重、短摘要、行情状态标签。若百炼实际 model_id 不同，只改 model_name。",
  },
];

const aiAgentInstanceRows = [
  {
    agent_id: "agent_trader_statement_listener",
    name: "交易员言论监听 Agent",
    role_type: "listener",
    llm_definition_id: "llm_bailian_qwen36_flash",
    prompt_id: "prompt_extract_coordinates_from_statement",
    prompt_version: "0.1",
    workflow_type: "n8n / websocket later",
    workflow_ref: "gpt-trader-statement-listener",
    trigger_type: "webhook / stream",
    schedule_rule: "on_message",
    input_sources: "Whop/Discord/网页总结/OCR",
    output_targets: "coordinate_candidate_queue",
    write_scope: "raw_events, coordinate_candidates",
    guardrails: "必须保留原文和来源；只写候选，不写事实表。",
    review_policy: "高置信度仍进入待审。",
    telemetry: "记录输入条数、LLM 耗时、解析失败率。",
    status: "planned",
    last_run_at: "",
    notes: "高频监听先走 flash，只抽取候选坐标和证据，不做复杂判断。",
  },
  {
    agent_id: "agent_historical_coordinate_miner",
    name: "历史坐标挖掘 Agent",
    role_type: "miner",
    llm_definition_id: "llm_bailian_qwen36_plus",
    prompt_id: "prompt_mine_coordinates_from_history",
    prompt_version: "0.1",
    workflow_type: "local_harness / cron",
    workflow_ref: "harness-history-coordinate-miner",
    trigger_type: "schedule",
    schedule_rule: "daily_after_close",
    input_sources: "stock.autoin crawl、DOCX/OCR、BC 历史行情、事件日历",
    output_targets: "horizontal_coordinate, vertical_coordinate, evidence_queue",
    write_scope: "definition_candidates only",
    guardrails: "不得使用未来函数；必须输出 evidence_ids。",
    review_policy: "新增定义必须人工确认后启用。",
    telemetry: "记录样本数、候选数、去重率、失败原因。",
    status: "planned",
    last_run_at: "",
    notes: "负责从历史里提新坐标定义，不直接产生实盘建议。",
  },
  {
    agent_id: "agent_market_state_monitor",
    name: "市场状态监听 Agent",
    role_type: "state_monitor",
    llm_definition_id: "llm_bailian_qwen36_flash",
    prompt_id: "prompt_summarize_market_state",
    prompt_version: "0.1",
    workflow_type: "n8n / local_harness",
    workflow_ref: "gpt-market-state-monitor",
    trigger_type: "schedule",
    schedule_rule: "1m/5m during active windows",
    input_sources: "BC 行情、BTC WebSocket、QQQ/SPY、黄金、原油、VIX",
    output_targets: "horizontal_coordinate_occurrence, vertical_coordinate_occurrence, path_instance",
    write_scope: "occurrence tables and state snapshots",
    guardrails: "只标记状态和触发，不输出下单指令。",
    review_policy: "异常状态推送人工确认。",
    telemetry: "记录 API 耗时、数据延迟、LLM 耗时、推送耗时。",
    status: "planned",
    last_run_at: "",
    notes: "高频状态标签先走 flash；遇到冲突、异常或高影响事件再升级 plus。",
  },
  {
    agent_id: "agent_path_generator",
    name: "Path 生成 Agent",
    role_type: "path_generator",
    llm_definition_id: "llm_bailian_qwen36_plus",
    prompt_id: "prompt_generate_path_candidate",
    prompt_version: "0.1",
    workflow_type: "local_harness",
    workflow_ref: "harness-path-generator",
    trigger_type: "event",
    schedule_rule: "when new coordinate candidates pass threshold",
    input_sources: "横坐标实例、纵坐标实例、资金状态、历史相似样本",
    output_targets: "path_definition_candidates, path_instance",
    write_scope: "path candidates only",
    guardrails: "必须包含失效条件和验证计划。",
    review_policy: "所有新 path 定义人工审核。",
    telemetry: "记录生成数量、合并数量、被拒绝原因。",
    status: "planned",
    last_run_at: "",
    notes: "把坐标串成 path，不负责最终验证。",
  },
  {
    agent_id: "agent_path_validator",
    name: "Path 验证 Agent",
    role_type: "validator",
    llm_definition_id: "llm_bailian_qwen36_plus",
    prompt_id: "prompt_validate_path_no_lookahead",
    prompt_version: "0.1",
    workflow_type: "local_harness / batch",
    workflow_ref: "harness-path-validator",
    trigger_type: "schedule / manual",
    schedule_rule: "daily_after_close and manual_review",
    input_sources: "path_definition、path_instance、历史行情、事件日历",
    output_targets: "path_evaluation, review_queue",
    write_scope: "evaluation tables",
    guardrails: "必须检查 no-lookahead、样本数和失效条件。",
    review_policy: "验证结果由人工确认后提升置信度。",
    telemetry: "记录回测耗时、样本数、胜率、错误率。",
    status: "planned",
    last_run_at: "",
    notes: "统一用 plus 做反证、no-lookahead 检查和验证结论摘要。",
  },
  {
    agent_id: "agent_knowledge_curator",
    name: "知识库策展 Agent",
    role_type: "curator",
    llm_definition_id: "llm_bailian_qwen36_plus",
    prompt_id: "prompt_curate_coordinate_path_library",
    prompt_version: "0.1",
    workflow_type: "manual / weekly_cron",
    workflow_ref: "harness-knowledge-curator",
    trigger_type: "schedule",
    schedule_rule: "weekly",
    input_sources: "coordinate definitions、path definitions、验证结果、人工反馈",
    output_targets: "review_queue, changelog",
    write_scope: "proposed updates only",
    guardrails: "只能提议合并/降级/废弃，不自动删除。",
    review_policy: "人工批准后执行变更。",
    telemetry: "记录合并建议、冲突数、废弃建议数。",
    status: "planned",
    last_run_at: "",
    notes: "负责让库保持干净，而不是越来越乱。",
  },
];

const sources = [
  {
    name: "BC 行情 API",
    type: "行情数据",
    coverage: "美股、ETF、期权、K线、快照；后续作为历史验证和实时监听主源。",
    status: "已知可接",
  },
  {
    name: "Binance/BTC 实时流",
    type: "跨市场预警",
    coverage: "BTC/ETH 价格、分钟波动、整数关口、成交额；适合 WebSocket 连续监听。",
    status: "待接入",
  },
  {
    name: "美国假期日历",
    type: "交易日历",
    coverage: "美股休市、半日市和节假日前后窗口。",
    status: "待接入",
  },
  {
    name: "美联储 FOMC 日历",
    type: "宏观事件",
    coverage: "议息、纪要、点阵图、主席讲话等可预知事件窗口。",
    status: "待接入",
  },
  {
    name: "中国假期日历",
    type: "交易日历",
    coverage: "A股/港股/中国节假日对跨市场风险偏好的影响窗口。",
    status: "待接入",
  },
];

const dataSourceDefinitionSchema = [
  ["id", "数据源定义唯一 ID。"],
  ["name", "数据源名称。"],
  ["source_type", "类型：market_data、crypto_stream、holiday_calendar、macro_calendar。"],
  ["provider", "供应商或来源。"],
  ["access_protocol", "REST、WebSocket、local_file、crawler、manual_upload。"],
  ["endpoint_ref", "端点或路径引用，不写密钥。"],
  ["auth_ref", "鉴权引用，例如 env:BC_API_TOKEN。"],
  ["data_domains", "提供哪些数据域：price、trades、nbbo、options、news、events。"],
  ["update_mode", "更新方式：stream、scheduled_pull、manual、one_time_crawl。"],
  ["expected_latency", "预期延迟。"],
  ["historical_coverage", "历史覆盖范围。"],
  ["retention_policy", "本地保留策略。"],
  ["normalization_target", "落到哪些本地标准表。"],
  ["status", "active、planned、paused、archived。"],
  ["notes", "补充说明。"],
];

const symbolDataMapSchema = [
  ["symbol", "标的代码。"],
  ["asset_type", "stock、etf、crypto、future、index、option_underlying。"],
  ["market", "市场：US、crypto、macro、CN、HK。"],
  ["primary_sources", "主要数据来源。"],
  ["price_data", "是否有自身价格数据。"],
  ["trade_data", "是否有逐笔成交或 trade 数据。"],
  ["nbbo_data", "是否有 NBBO/quote 数据。"],
  ["bar_data", "是否有分钟线/日线。"],
  ["snapshot_data", "是否有快照。"],
  ["option_chain_data", "是否有期权链。"],
  ["option_trade_quote_data", "是否有期权逐笔/报价/IV。"],
  ["news_event_data", "是否有新闻、财报、事件。"],
  ["coverage_start", "本地数据最早时间。"],
  ["coverage_end", "本地数据最新时间。"],
  ["last_updated", "最近更新时间。"],
  ["quality_status", "ready、partial、planned、stale。"],
  ["notes", "补充说明。"],
];

const dataSourceDefinitionRows = [
  {
    id: "src_bc_market_data",
    name: "BC 行情 API",
    source_type: "market_data",
    provider: "bcprivateserver.site",
    access_protocol: "REST",
    endpoint_ref: "config:BC_API_BASE",
    auth_ref: "env:BC_API_TOKEN",
    data_domains: "price,trades,bars,snapshot,options,news",
    update_mode: "scheduled_pull / on_demand",
    expected_latency: "API dependent",
    historical_coverage: "按端点和标的决定",
    retention_policy: "raw + normalized parquet/sqlite later",
    normalization_target: "symbol_data_map, bars, trades, option_chain, news",
    status: "active",
    notes: "主行情源；页面不展示 token。",
  },
  {
    id: "src_binance_crypto_stream",
    name: "Binance BTC/ETH 实时流",
    source_type: "crypto_stream",
    provider: "Binance public market data",
    access_protocol: "WebSocket / REST fallback",
    endpoint_ref: "config:BINANCE_STREAM_BASE",
    auth_ref: "none_for_public_market_data",
    data_domains: "crypto_price,trades,volume,alerts",
    update_mode: "stream",
    expected_latency: "sub-second to seconds",
    historical_coverage: "stream forward; REST for backfill",
    retention_policy: "tick/minute aggregates",
    normalization_target: "crypto_ticks,crypto_bars,symbol_data_map",
    status: "planned",
    notes: "用于 BTC/ETH 先行和币股预警。",
  },
  {
    id: "src_us_holiday_calendar",
    name: "美国假期日历",
    source_type: "holiday_calendar",
    provider: "US market calendar provider",
    access_protocol: "REST / file import",
    endpoint_ref: "config:US_HOLIDAY_CALENDAR_SOURCE",
    auth_ref: "env:CALENDAR_API_KEY optional",
    data_domains: "us_holidays,market_closures,half_days",
    update_mode: "scheduled_pull",
    expected_latency: "daily",
    historical_coverage: "待接入",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,market_sessions,horizontal_coordinate_occurrence",
    status: "planned",
    notes: "用于节假日前后、半日市和交易日判定。",
  },
  {
    id: "src_fomc_calendar",
    name: "美联储 FOMC 日历",
    source_type: "macro_calendar",
    provider: "Federal Reserve / calendar provider",
    access_protocol: "REST / file import",
    endpoint_ref: "config:FOMC_CALENDAR_SOURCE",
    auth_ref: "env:CALENDAR_API_KEY optional",
    data_domains: "fomc_meeting,minutes,dot_plot,powell_speech",
    update_mode: "scheduled_pull",
    expected_latency: "daily / event dependent",
    historical_coverage: "待接入",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,horizontal_coordinate_occurrence",
    status: "planned",
    notes: "用于 FOMC 前后横坐标和事件节点。",
  },
  {
    id: "src_cn_holiday_calendar",
    name: "中国假期日历",
    source_type: "holiday_calendar",
    provider: "CN market calendar provider",
    access_protocol: "REST / file import",
    endpoint_ref: "config:CN_HOLIDAY_CALENDAR_SOURCE",
    auth_ref: "env:CALENDAR_API_KEY optional",
    data_domains: "cn_holidays,cn_market_closures,hk_connect_closures",
    update_mode: "scheduled_pull",
    expected_latency: "daily",
    historical_coverage: "待接入",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,market_sessions,horizontal_coordinate_occurrence",
    status: "planned",
    notes: "用于中国节假日、港股通/跨市场风险窗口。",
  },
];

const symbolDataMapRows = [
  {
    symbol: "SPY",
    asset_type: "ETF",
    market: "US",
    primary_sources: "src_bc_market_data",
    price_data: "yes",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "yes/planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "event_calendar planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "指数和 0DTE path 的核心标的。",
    datasets: [
      { domain: "price", status: "partial", granularity: "snapshot / bars later", source: "BC API", range: "pending scan", last_updated: "pending", detail: "用于横纵坐标实例和 path 回测。" },
      { domain: "trades", status: "planned", granularity: "tick/trade", source: "BC API if available", range: "not loaded", last_updated: "n/a", detail: "用于微观成交确认。" },
      { domain: "nbbo", status: "planned", granularity: "quote/NBBO", source: "BC API if available", range: "not loaded", last_updated: "n/a", detail: "用于价差和盘口确认。" },
      { domain: "options_chain", status: "planned", granularity: "chain by expiry/strike", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于 0DTE、IV、行权价距离。" },
      { domain: "options_trades_quotes", status: "planned", granularity: "trade/quote/IV", source: "BC API / future provider", range: "not loaded", last_updated: "n/a", detail: "用于强平和权利金纵坐标。" },
      { domain: "events", status: "planned", granularity: "calendar", source: "event calendar", range: "not loaded", last_updated: "n/a", detail: "期权结算、四巫日、假期。" },
    ],
  },
  {
    symbol: "QQQ",
    asset_type: "ETF",
    market: "US",
    primary_sources: "src_bc_market_data",
    price_data: "yes",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "yes/planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "event_calendar planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "科技指数和七姐妹宽度代理。",
    datasets: [
      { domain: "price", status: "partial", granularity: "snapshot / bars later", source: "BC API", range: "pending scan", last_updated: "pending", detail: "用于指数强弱和缺口阶梯。" },
      { domain: "options_chain", status: "planned", granularity: "chain by expiry/strike", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于周五结算和 IV。" },
      { domain: "events", status: "planned", granularity: "macro/calendar", source: "event calendar", range: "not loaded", last_updated: "n/a", detail: "FOMC、讲话、财报季。" },
    ],
  },
  {
    symbol: "TSLA",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_us_holiday_calendar, src_fomc_calendar",
    price_data: "yes",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "yes/planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "earnings/corporate planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "明星股和 TSLL 参照核心。",
    datasets: [
      { domain: "price", status: "partial", granularity: "premarket/regular/afterhours bars later", source: "BC API", range: "pending scan", last_updated: "pending", detail: "用于盘前低点、二次握手、财报低点。" },
      { domain: "options_chain", status: "planned", granularity: "chain", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于财报 IV、权利金和展期。" },
      { domain: "events", status: "planned", granularity: "earnings/corporate", source: "event calendar/news", range: "not loaded", last_updated: "n/a", detail: "财报、电话会、股东增持、新闻。" },
    ],
  },
  {
    symbol: "NVDA",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_us_holiday_calendar, src_fomc_calendar",
    price_data: "yes",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "yes/planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "earnings/product events planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "明星股、NVDL 参照核心。",
    datasets: [
      { domain: "price", status: "partial", granularity: "bars later", source: "BC API", range: "pending scan", last_updated: "pending", detail: "用于明星股宽度和事件反应。" },
      { domain: "events", status: "planned", granularity: "earnings/product conference", source: "event calendar", range: "not loaded", last_updated: "n/a", detail: "财报、GTC、产品会。" },
      { domain: "options", status: "planned", granularity: "chain/trades/IV", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于高 IV 事件和强平。" },
    ],
  },
  {
    symbol: "COIN",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_binance_crypto_stream",
    price_data: "yes",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "yes/planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "crypto/news planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "币股核心，依赖 BTC/ETH 先行数据。",
    datasets: [
      { domain: "price", status: "partial", granularity: "bars later", source: "BC API", range: "pending scan", last_updated: "pending", detail: "用于币股延迟确认。" },
      { domain: "crypto_lead", status: "planned", granularity: "BTC/ETH stream", source: "Binance", range: "forward", last_updated: "n/a", detail: "用于 1-5 分钟 lead-lag。" },
      { domain: "options", status: "planned", granularity: "chain/trades/IV", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于 CONL/COIN 高波动期权。" },
    ],
  },
  {
    symbol: "BTCUSDT",
    asset_type: "crypto",
    market: "crypto",
    primary_sources: "src_binance_crypto_stream",
    price_data: "planned",
    trade_data: "planned",
    nbbo_data: "n/a",
    bar_data: "1m/5m planned",
    snapshot_data: "planned",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "macro/crypto events planned",
    coverage_start: "forward after websocket",
    coverage_end: "streaming",
    last_updated: "pending",
    quality_status: "planned",
    notes: "跨市场预警源，不是美股标的。",
    datasets: [
      { domain: "price_stream", status: "planned", granularity: "tick/aggTrade", source: "Binance WebSocket", range: "forward", last_updated: "n/a", detail: "用于 BTC 分钟预警价。" },
      { domain: "bars", status: "planned", granularity: "1m/3m/5m aggregates", source: "Binance REST/WebSocket", range: "forward + backfill", last_updated: "n/a", detail: "用于 lead-lag 特征。" },
      { domain: "alerts", status: "planned", granularity: "delta pct / round levels", source: "local harness", range: "runtime", last_updated: "n/a", detail: "用于生成横纵坐标实例。" },
    ],
  },
  {
    symbol: "MSTR",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_binance_crypto_stream",
    price_data: "planned",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "crypto/news planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "planned",
    notes: "BTC 高 beta 代理。",
    datasets: [
      { domain: "price", status: "planned", granularity: "bars", source: "BC API", range: "pending scan", last_updated: "n/a", detail: "用于 BTC 到币股 path。" },
      { domain: "options", status: "planned", granularity: "chain/trades/IV", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于高波动期权。" },
    ],
  },
  {
    symbol: "AAPL",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_us_holiday_calendar, src_fomc_calendar",
    price_data: "planned",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "earnings planned",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "planned",
    notes: "慢性股/大盘稳定权重。",
    datasets: [
      { domain: "price", status: "planned", granularity: "bars", source: "BC API", range: "pending scan", last_updated: "n/a", detail: "用于慢性股对照组。" },
      { domain: "events", status: "planned", granularity: "earnings/corporate", source: "event calendar", range: "not loaded", last_updated: "n/a", detail: "用于财报和权重股影响。" },
    ],
  },
];

const pageMeta = {
  horizontal: {
    kicker: "Coordinate Library",
    title: "横坐标库",
    summary:
      "横坐标管理时间、事件和跨市场先后关系。它回答的不是“现在几点”，而是市场推进到了哪个阶段、哪些未来事件已经可知、哪些窗口会改变资金行为。",
  },
  vertical: {
    kicker: "Price Map",
    title: "纵坐标库",
    summary:
      "纵坐标管理价格结构，不存孤立数字，而存价格从哪里来、在哪个时间窗口有效、被什么条件击穿后失效。股票价格、期权权利金和 IV 要分开管理。",
  },
  paths: {
    kicker: "Path Workspace",
    title: "Path管理",
    summary:
      "这里先只做 path 模板和管理框架，不急着生成交易建议。每条 path 都必须由横坐标链、纵坐标序列、资金状态假设、失效条件和验证口径组成。",
  },
  agents: {
    kicker: "Agent Registry",
    title: "AI Agent接入管理",
    summary:
      "当前只接入百炼的 qwen3.6-plus 和 qwen3.6-flash。flash 负责高频初筛和短摘要，plus 负责复杂抽取、Path 生成、验证和知识库整理。",
  },
  sources: {
    kicker: "Data Connectors",
    title: "数据源接入管理",
    summary:
      "数据源先只保留运行系统马上需要接入的行情、跨市场预警和日历数据。一次性导入材料和未来数据源暂不放入当前列表。",
  },
  spec: {
    kicker: "Entity Spec",
    title: "实体关系图 / Spec",
    summary:
      "这里把原型里的实体关系、外键字段和入库校验规则固定下来。后续 Agent、爬虫、n8n 或本地 harness 写入这些实体时，都要按这份 spec 走。",
  },
};

const metrics = {
  horizontal: [
    ["22,897", "历史总结中的横坐标候选片段"],
    ["7 类", "周内、日内、事件、月度、跨市场等时间结构"],
    ["UTC+8 / ET", "必须显式保存时间口径"],
    ["No-lookahead", "未来事件需区分当时是否已知"],
  ],
  vertical: [
    ["22,078", "历史总结中的纵坐标候选片段"],
    ["8 类", "低点、缺口、强平、财报、BTC、期权等价格结构"],
    ["Price Map", "保存元价格而不是裸价格"],
    ["失效条件", "每个纵坐标都要有 invalidated_by"],
  ],
  paths: [
    ["4 条", "第一版 path 模板"],
    ["Box", "最小单位是时间节点里的价格反应"],
    ["资金状态", "把价格变化和流入流出假设连接起来"],
    ["人工审查", "AI 只提候选，交易员决定是否入库"],
  ],
  agents: [
    ["2 个模型", "qwen3.6-plus / qwen3.6-flash"],
    ["1 个密钥引用", "统一使用 env:BAILIAN_API_KEY"],
    ["6 个角色", "监听、挖掘、状态、生成、验证、策展"],
    ["分层调用", "flash 初筛，plus 深加工"],
  ],
  sources: [
    ["5 个", "当前保留的数据源"],
    ["行情 + 日历", "先服务实时监听和回测"],
    ["BC / Binance", "价格与跨市场预警主源"],
    ["假期 / FOMC", "事件横坐标基础源"],
  ],
};

const state = {
  page: "horizontal",
  filter: "全部",
  search: "",
  selectedId: null,
  pathFilter: "全部",
  horizontalEntity: "definition",
  horizontalSearch: "",
  verticalEntity: "definition",
  verticalSearch: "",
  pathEntity: "definition",
  pathSearch: "",
  selectedPathRecordId: null,
  selectedPathNodeId: null,
  pathCanvasPositions: {
    definition: {},
    instance: {},
  },
  agentEntity: "definition",
  agentSearch: "",
  sourceEntity: "definition",
  sourceSearch: "",
  selectedDataSymbol: null,
  agentSwitches: new Set(),
};

const runtimeVariableRegistry = {
  "env:BAILIAN_API_KEY": {
    kind: "环境变量",
    status: "已登记",
    maskedValue: "sk-da6472***************a12cd4",
    note: "百炼 API Key。页面只保存脱敏值，不保存明文 token。",
  },
  "env:BC_API_TOKEN": {
    kind: "环境变量",
    status: "已登记",
    maskedValue: "bc_iLBzu***************SHRo",
    note: "BC 行情 API token。页面只保存脱敏值，不保存明文 token。",
  },
  "config:BAILIAN_API_BASE": {
    kind: "配置项",
    status: "待接入",
    maskedValue: "未在静态页登记",
    note: "百炼 API base 配置引用；后续接后端配置读取。",
  },
  "config:BC_API_BASE": {
    kind: "配置项",
    status: "已知",
    maskedValue: "http://bcprivateserver.site",
    note: "BC 行情 API base URL，不属于密钥。",
  },
  "config:BINANCE_STREAM_BASE": {
    kind: "配置项",
    status: "计划接入",
    maskedValue: "Binance public market data endpoint",
    note: "公开行情端点，后续用于 BTC/ETH WebSocket 或 REST fallback。",
  },
  "config:US_HOLIDAY_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "未配置",
    maskedValue: "未知",
    note: "美国假期和美股交易日历来源还没有接入真实配置。",
  },
  "config:FOMC_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "未配置",
    maskedValue: "未知",
    note: "FOMC 日历来源还没有接入真实配置。",
  },
  "config:CN_HOLIDAY_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "未配置",
    maskedValue: "未知",
    note: "中国假期日历来源还没有接入真实配置。",
  },
  "env:CALENDAR_API_KEY": {
    kind: "环境变量",
    status: "未配置",
    maskedValue: "未知",
    note: "日历数据源可选密钥，目前未登记。",
  },
};

const backendState = {
  connected: false,
  version: APP_VERSION,
  dbPath: "",
  error: "",
};

function replaceRows(targetRows, nextRows) {
  if (!Array.isArray(nextRows)) return;
  targetRows.splice(0, targetRows.length, ...nextRows);
}

function applyBackendBootstrap(payload) {
  replaceRows(horizontalDefinitionRows, payload.horizontalDefinitionRows);
  replaceRows(horizontalOccurrenceRows, payload.horizontalOccurrenceRows);
  replaceRows(verticalDefinitionRows, payload.verticalDefinitionRows);
  replaceRows(verticalOccurrenceRows, payload.verticalOccurrenceRows);
  replaceRows(pathDefinitionRows, payload.pathDefinitionRows);
  replaceRows(pathInstanceRows, payload.pathInstanceRows);
  replaceRows(llmApiDefinitionRows, payload.llmApiDefinitionRows);
  replaceRows(aiAgentInstanceRows, payload.aiAgentInstanceRows);
  replaceRows(dataSourceDefinitionRows, payload.dataSourceDefinitionRows);
  replaceRows(symbolDataMapRows, payload.symbolDataMapRows);

  backendState.connected = true;
  backendState.version = payload.meta?.version || APP_VERSION;
  backendState.dbPath = payload.meta?.db_path || "";
  backendState.error = "";
  updateRuntimeChrome();
}

async function loadBackendData() {
  try {
    const response = await fetch(BACKEND_BOOTSTRAP_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const payload = await response.json();
    applyBackendBootstrap(payload);
    render();
  } catch (error) {
    backendState.connected = false;
    backendState.error = error?.message || "API unavailable";
    updateRuntimeChrome();
  }
}

function updateRuntimeChrome() {
  const versionEl = document.querySelector("#app-version");
  const captionEl = document.querySelector("#version-caption");
  const statusEl = document.querySelector("#runtime-status");
  if (versionEl) versionEl.textContent = backendState.version;
  if (captionEl) {
    captionEl.textContent = backendState.connected
      ? "本地 API + SQLite 数据库运行中。"
      : "0.1 alpha 前端已加载，等待本地 API。";
  }
  if (statusEl) {
    statusEl.textContent = backendState.connected ? "API + SQLite" : "0.1 alpha";
    statusEl.title = backendState.connected
      ? `后端已连接；数据库：${backendState.dbPath || "path_harness.sqlite"}`
      : `后端未连接：${backendState.error || "等待 API"}`;
  }
}

const fieldLabelMap = {
  id: "ID",
  name: "名称",
  category: "分类",
  coordinate_type: "坐标类型",
  definition: "定义",
  original_time_text: "原始时间",
  time_basis: "时间口径",
  timezone: "规范时区",
  dst_policy: "夏令时规则",
  anchor: "锚点",
  start_rule: "开始规则",
  end_rule: "结束规则",
  known_at_rule: "已知规则",
  recurrence: "发生频率",
  market_scope: "市场范围",
  symbol_scope: "标的范围",
  flow_tags: "资金标签",
  linked_vertical_types: "关联纵坐标",
  data_requirements: "数据要求",
  check_frequency: "检查频率",
  evidence_count: "证据数",
  confidence: "置信度",
  status: "状态",
  notes: "备注",
  occurrence_id: "实例ID",
  coordinate_id: "定义ID",
  trade_date: "归属窗口",
  start_at_local: "本地开始",
  end_at_local: "本地结束",
  start_at_utc: "UTC开始",
  end_at_utc: "UTC结束",
  known_at_utc: "已知框架",
  activation_state: "激活状态",
  observed_context: "观察上下文",
  generated_vertical_ids: "生成纵坐标",
  path_ids: "关联Path",
  price_domain: "价格域",
  computation_method: "计算方法",
  source_window_rule: "来源窗口",
  required_horizontal_ids: "依赖横坐标",
  input_data: "输入数据",
  value_unit: "数值单位",
  valid_from_rule: "生效规则",
  valid_until_rule: "有效期规则",
  invalidated_by: "失效条件",
  symbol: "标的",
  value: "数值",
  currency: "货币",
  source_window_start_utc: "窗口开始框架",
  source_window_end_utc: "窗口结束框架",
  computed_at_utc: "计算框架",
  horizontal_occurrence_ids: "横坐标实例",
  vertical_occurrence_ids: "纵坐标实例",
  data_source: "数据来源",
  valid_until_utc: "有效至框架",
  invalidation_state: "失效状态",
  invalidated_at_utc: "失效时间",
  evidence_ids: "证据ID",
  path_family: "Path家族",
  version: "版本",
  description: "描述",
  node_sequence: "节点链",
  edge_rules: "转移规则",
  horizontal_definition_ids: "横坐标定义",
  vertical_definition_ids: "纵坐标定义",
  flow_hypothesis: "资金假设",
  entry_observation_rule: "观察入口",
  invalidation_rule: "失效规则",
  evaluation_plan: "验证计划",
  time_scope: "时间范围",
  required_data: "所需数据",
  discovered_by: "发现者",
  owner_agent: "维护Agent",
  instance_id: "实例ID",
  path_definition_id: "Path定义ID",
  symbols: "标的集合",
  started_at_utc: "开始框架",
  ended_at_utc: "结束框架",
  current_node_id: "当前节点",
  observed_node_sequence: "实际节点链",
  outcome_label: "结果标签",
  return_30m: "30m收益",
  return_1h: "1h收益",
  return_close: "收盘收益",
  mfe: "最大有利",
  mae: "最大不利",
  human_review_state: "人工复盘",
  provider: "供应商",
  model_name: "模型名",
  model_family: "模型家族",
  api_protocol: "API协议",
  api_base_ref: "API地址引用",
  auth_method: "鉴权方式",
  credential_ref: "密钥引用",
  context_window: "上下文长度",
  modalities: "模态",
  tool_calling: "工具调用",
  json_mode: "JSON模式",
  streaming: "流式输出",
  default_temperature: "默认温度",
  max_output_tokens: "输出上限",
  timeout_ms: "超时",
  rate_limit_policy: "限速策略",
  cost_tier: "成本层级",
  agent_id: "Agent ID",
  role_type: "角色类型",
  llm_definition_id: "模型定义ID",
  prompt_id: "Prompt ID",
  prompt_version: "Prompt版本",
  workflow_type: "流程类型",
  workflow_ref: "流程引用",
  trigger_type: "触发方式",
  schedule_rule: "调度规则",
  input_sources: "输入源",
  output_targets: "输出目标",
  write_scope: "写入范围",
  guardrails: "约束",
  review_policy: "审核策略",
  telemetry: "运行指标",
  last_run_at: "最近运行",
  source_type: "来源类型",
  access_protocol: "接入协议",
  endpoint_ref: "端点引用",
  auth_ref: "鉴权引用",
  data_domains: "数据域",
  update_mode: "更新方式",
  expected_latency: "预期延迟",
  historical_coverage: "历史覆盖",
  retention_policy: "保留策略",
  normalization_target: "标准化目标",
  asset_type: "资产类型",
  market: "市场",
  primary_sources: "主要来源",
  price_data: "价格数据",
  trade_data: "成交数据",
  nbbo_data: "NBBO数据",
  bar_data: "K线数据",
  snapshot_data: "快照数据",
  option_chain_data: "期权链",
  option_trade_quote_data: "期权成交报价",
  news_event_data: "新闻事件",
  coverage_start: "覆盖开始",
  coverage_end: "覆盖结束",
  last_updated: "最近更新",
  quality_status: "质量状态",
};

const entityRegistry = {
  horizontal: {
    definition: {
      label: "横坐标定义",
      table: "horizontal_coordinate",
      idField: "id",
      rows: horizontalDefinitionRows,
    },
    occurrence: {
      label: "横坐标实例",
      table: "horizontal_coordinate_occurrence",
      idField: "occurrence_id",
      rows: horizontalOccurrenceRows,
    },
  },
  vertical: {
    definition: {
      label: "纵坐标定义",
      table: "vertical_coordinate",
      idField: "id",
      rows: verticalDefinitionRows,
    },
    occurrence: {
      label: "纵坐标实例",
      table: "vertical_coordinate_occurrence",
      idField: "occurrence_id",
      rows: verticalOccurrenceRows,
    },
  },
  paths: {
    definition: {
      label: "Path 定义",
      table: "path_definition",
      idField: "id",
      rows: pathDefinitionRows,
    },
    instance: {
      label: "Path 实例",
      table: "path_instance",
      idField: "instance_id",
      rows: pathInstanceRows,
    },
  },
  agents: {
    definition: {
      label: "模型 API 定义",
      table: "llm_api_definition",
      idField: "id",
      rows: llmApiDefinitionRows,
    },
    instance: {
      label: "Agent 实例",
      table: "ai_agent_instance",
      idField: "agent_id",
      rows: aiAgentInstanceRows,
    },
  },
  sources: {
    definition: {
      label: "数据源头定义",
      table: "data_source_definition",
      idField: "id",
      rows: dataSourceDefinitionRows,
    },
    map: {
      label: "标的数据地图",
      table: "symbol_data_map",
      idField: "symbol",
      rows: symbolDataMapRows,
    },
  },
};

const referenceFieldRules = [
  {
    sourcePage: "horizontal",
    sourceEntity: "definition",
    field: "linked_vertical_types",
    targetPage: "vertical",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "只能写 vertical_coordinate.id；不允许写中文标签或临时短语。",
  },
  {
    sourcePage: "horizontal",
    sourceEntity: "occurrence",
    field: "coordinate_id",
    targetPage: "horizontal",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "每个横坐标实例必须回指一个已存在的横坐标定义。",
  },
  {
    sourcePage: "horizontal",
    sourceEntity: "occurrence",
    field: "generated_vertical_ids",
    targetPage: "vertical",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "记录该横坐标实例可能生成的纵坐标定义；具体价格值另写 vertical_coordinate_occurrence。",
  },
  {
    sourcePage: "horizontal",
    sourceEntity: "occurrence",
    field: "path_ids",
    targetPage: "paths",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "只允许引用 path_definition.id。",
  },
  {
    sourcePage: "vertical",
    sourceEntity: "definition",
    field: "required_horizontal_ids",
    targetPage: "horizontal",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "纵坐标定义依赖的横坐标必须是 horizontal_coordinate.id。",
  },
  {
    sourcePage: "vertical",
    sourceEntity: "occurrence",
    field: "coordinate_id",
    targetPage: "vertical",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "每个纵坐标实例必须回指一个已存在的纵坐标定义。",
  },
  {
    sourcePage: "vertical",
    sourceEntity: "occurrence",
    field: "horizontal_occurrence_ids",
    targetPage: "horizontal",
    targetEntity: "occurrence",
    cardinality: "N:N",
    rule: "具体价格实例必须能追溯到触发它的横坐标实例。",
  },
  {
    sourcePage: "vertical",
    sourceEntity: "occurrence",
    field: "path_ids",
    targetPage: "paths",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "纵坐标实例参与的 Path 必须使用 path_definition.id。",
  },
  {
    sourcePage: "paths",
    sourceEntity: "definition",
    field: "horizontal_definition_ids",
    targetPage: "horizontal",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "Path 定义只能串联横坐标定义，不写具体日期实例。",
  },
  {
    sourcePage: "paths",
    sourceEntity: "definition",
    field: "vertical_definition_ids",
    targetPage: "vertical",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "Path 定义只能引用纵坐标定义，不写裸价格或具体日期。",
  },
  {
    sourcePage: "paths",
    sourceEntity: "instance",
    field: "path_definition_id",
    targetPage: "paths",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "每个 Path 实例必须回指一个已存在的 Path 定义。",
  },
  {
    sourcePage: "paths",
    sourceEntity: "instance",
    field: "horizontal_occurrence_ids",
    targetPage: "horizontal",
    targetEntity: "occurrence",
    cardinality: "N:N",
    rule: "Path 实例只能记录当时实际触发的横坐标实例。",
  },
  {
    sourcePage: "paths",
    sourceEntity: "instance",
    field: "vertical_occurrence_ids",
    targetPage: "vertical",
    targetEntity: "occurrence",
    cardinality: "N:N",
    rule: "Path 实例引用具体发生的纵坐标实例；不要把定义 ID 写进实例字段。",
  },
  {
    sourcePage: "agents",
    sourceEntity: "instance",
    field: "llm_definition_id",
    targetPage: "agents",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "Agent 实例必须绑定一个已登记的大模型 API 定义。",
  },
  {
    sourcePage: "sources",
    sourceEntity: "map",
    field: "primary_sources",
    targetPage: "sources",
    targetEntity: "definition",
    cardinality: "N:N",
    rule: "标的数据地图只能引用已登记的数据源头定义。",
  },
];

const specDiagramNodes = [
  { id: "hc_def", title: "横坐标定义", code: "horizontal_coordinate", page: "horizontal", entity: "definition", x: 26, y: 42 },
  { id: "hc_occ", title: "横坐标实例", code: "horizontal_coordinate_occurrence", page: "horizontal", entity: "occurrence", x: 304, y: 42 },
  { id: "vc_def", title: "纵坐标定义", code: "vertical_coordinate", page: "vertical", entity: "definition", x: 26, y: 192 },
  { id: "vc_occ", title: "纵坐标实例", code: "vertical_coordinate_occurrence", page: "vertical", entity: "occurrence", x: 304, y: 192 },
  { id: "path_def", title: "Path 定义", code: "path_definition", page: "paths", entity: "definition", x: 582, y: 96 },
  { id: "path_inst", title: "Path 实例", code: "path_instance", page: "paths", entity: "instance", x: 830, y: 96 },
  { id: "llm_def", title: "模型接入定义", code: "llm_api_definition", page: "agents", entity: "definition", x: 582, y: 296 },
  { id: "agent_inst", title: "Agent 实例", code: "ai_agent_instance", page: "agents", entity: "instance", x: 830, y: 296 },
  { id: "src_def", title: "数据源头定义", code: "data_source_definition", page: "sources", entity: "definition", x: 26, y: 398 },
  { id: "symbol_map", title: "标的数据地图", code: "symbol_data_map", page: "sources", entity: "map", x: 304, y: 398 },
  { id: "dataset_cov", title: "标的数据域覆盖", code: "symbol_dataset_coverage", page: "sources", entity: "map", x: 582, y: 444 },
];

const specDiagramEdges = [
  { from: "hc_def", to: "hc_occ", label: "实例化 1:N" },
  { from: "vc_def", to: "vc_occ", label: "实例化 1:N" },
  { from: "hc_def", to: "vc_def", label: "依赖/生成 N:N" },
  { from: "hc_def", to: "path_def", label: "Path 使用" },
  { from: "vc_def", to: "path_def", label: "Path 使用" },
  { from: "path_def", to: "path_inst", label: "实例化 1:N" },
  { from: "hc_occ", to: "path_inst", label: "实盘触发" },
  { from: "vc_occ", to: "path_inst", label: "实盘结果" },
  { from: "llm_def", to: "agent_inst", label: "绑定 1:N" },
  { from: "src_def", to: "symbol_map", label: "供给 N:N" },
  { from: "symbol_map", to: "dataset_cov", label: "细分 1:N" },
];

function getEntityConfig(page, entity) {
  return entityRegistry[page]?.[entity] || null;
}

function getEntityRows(page, entity) {
  return getEntityConfig(page, entity)?.rows || [];
}

function getEntityIdField(page, entity) {
  return getEntityConfig(page, entity)?.idField || "id";
}

function getEntityLabel(page, entity) {
  return getEntityConfig(page, entity)?.label || `${page}.${entity}`;
}

function getEntityTableName(page, entity) {
  return getEntityConfig(page, entity)?.table || `${page}.${entity}`;
}

function getRowPrimaryId(row, page, entity) {
  return row[getEntityIdField(page, entity)] || "";
}

function rowMatchesText(row, search) {
  const query = String(search || "").trim().toLowerCase();
  if (!query) return true;
  return Object.values(row)
    .filter((value) => !Array.isArray(value))
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function targetIdExists(target) {
  if (!target) return false;
  const idField = getEntityIdField(target.page, target.entity);
  return getEntityRows(target.page, target.entity).some((row) => String(row[idField]) === String(target.search));
}

function targetHasMatches(target) {
  if (!target) return false;
  if (targetIdExists(target)) return true;
  return getEntityRows(target.page, target.entity).some((row) => rowMatchesText(row, target.search));
}

function collectReferenceIssues() {
  const issues = [];
  referenceFieldRules.forEach((rule) => {
    getEntityRows(rule.sourcePage, rule.sourceEntity).forEach((row) => {
      const tokens = splitReferenceText(row[rule.field] || "");
      tokens.forEach((token) => {
        const target = inferReferenceTarget(token, rule.field) || {
          page: rule.targetPage,
          entity: rule.targetEntity,
          search: token,
        };
        const expectedTable = getEntityTableName(rule.targetPage, rule.targetEntity);
        const actualTable = getEntityTableName(target.page, target.entity);
        if (actualTable !== expectedTable || !targetIdExists(target)) {
          issues.push({
            sourceTable: getEntityTableName(rule.sourcePage, rule.sourceEntity),
            sourceId: getRowPrimaryId(row, rule.sourcePage, rule.sourceEntity),
            field: rule.field,
            token,
            expectedTable,
            actualTable,
          });
        }
      });
    });
  });
  return issues;
}

const pageDefaultEntities = {
  horizontal: "definition",
  vertical: "definition",
  paths: "definition",
  agents: "definition",
  sources: "definition",
};

function getPageSearchValue(page = state.page) {
  if (page === "horizontal") return state.horizontalSearch;
  if (page === "vertical") return state.verticalSearch;
  if (page === "paths") return state.pathSearch;
  if (page === "agents") return state.agentSearch;
  if (page === "sources") return state.sourceSearch;
  return state.search;
}

function getPageEntityValue(page = state.page) {
  if (page === "horizontal") return state.horizontalEntity;
  if (page === "vertical") return state.verticalEntity;
  if (page === "paths") return state.pathEntity;
  if (page === "agents") return state.agentEntity;
  if (page === "sources") return state.sourceEntity;
  return "";
}

function buildRouteHash() {
  const page = navItems.some((item) => item.key === state.page) ? state.page : "horizontal";
  const params = new URLSearchParams();
  const entity = getPageEntityValue(page);
  const defaultEntity = pageDefaultEntities[page];
  const search = getPageSearchValue(page).trim();

  if (entity && entity !== defaultEntity) params.set("entity", entity);
  if (search) params.set("q", search);
  if (page === "paths") {
    if (state.selectedPathRecordId) params.set("record", state.selectedPathRecordId);
    if (state.selectedPathNodeId) params.set("node", state.selectedPathNodeId);
  }
  if (page === "sources" && state.selectedDataSymbol) {
    params.set("symbol", state.selectedDataSymbol);
  }

  const query = params.toString();
  return `#${page}${query ? `?${query}` : ""}`;
}

function syncRoute({ replace = false } = {}) {
  const nextHash = buildRouteHash();
  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;
  if (replace) {
    window.history.replaceState(null, "", nextUrl);
    return;
  }
  window.history.pushState(null, "", nextUrl);
}

let searchRenderTimer = null;

function scheduleSearchRender() {
  if (searchRenderTimer) window.clearTimeout(searchRenderTimer);
  searchRenderTimer = window.setTimeout(() => {
    searchRenderTimer = null;
    render();
  }, 350);
}

function flushSearchRender() {
  if (!searchRenderTimer) return;
  window.clearTimeout(searchRenderTimer);
  searchRenderTimer = null;
  render();
}

function bindSearchInput(input, updateValue) {
  if (!input) return;
  input.addEventListener("input", (event) => {
    updateValue(event.target.value);
    scheduleSearchRender();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    updateValue(event.currentTarget.value);
    flushSearchRender();
    syncRoute();
  });
}

function resetRoutedState() {
  state.filter = "全部";
  state.search = "";
  state.selectedId = null;
  state.pathFilter = "全部";
  state.horizontalSearch = "";
  state.verticalSearch = "";
  state.pathSearch = "";
  state.selectedPathRecordId = null;
  state.selectedPathNodeId = null;
  state.agentSearch = "";
  state.sourceSearch = "";
  state.selectedDataSymbol = null;
}

function applyRouteFromHash() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const [pagePart, queryString = ""] = rawHash.split("?");
  const page = navItems.some((item) => item.key === pagePart) ? pagePart : "horizontal";
  const params = new URLSearchParams(queryString);
  const entityParam = params.get("entity");
  const q = params.get("q") || "";

  resetRoutedState();
  state.page = page;

  if (page === "horizontal") {
    state.horizontalEntity = entityParam === "occurrence" ? "occurrence" : "definition";
    state.horizontalSearch = q;
  } else {
    state.horizontalEntity = pageDefaultEntities.horizontal;
  }

  if (page === "vertical") {
    state.verticalEntity = entityParam === "occurrence" ? "occurrence" : "definition";
    state.verticalSearch = q;
  } else {
    state.verticalEntity = pageDefaultEntities.vertical;
  }

  if (page === "paths") {
    state.pathEntity = entityParam === "instance" ? "instance" : "definition";
    state.pathSearch = q;
    state.selectedPathRecordId = params.get("record") || null;
    state.selectedPathNodeId = params.get("node") || null;
  } else {
    state.pathEntity = pageDefaultEntities.paths;
  }

  if (page === "agents") {
    state.agentEntity = entityParam === "instance" ? "instance" : "definition";
    state.agentSearch = q;
  } else {
    state.agentEntity = pageDefaultEntities.agents;
  }

  if (page === "sources") {
    state.sourceEntity = entityParam === "map" ? "map" : "definition";
    state.sourceSearch = q;
    state.selectedDataSymbol = params.get("symbol") || null;
  } else {
    state.sourceEntity = pageDefaultEntities.sources;
  }
}

function mountNav() {
  const nav = document.querySelector("#nav");
  nav.innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-button" data-page="${item.key}" type="button">
          <span class="nav-icon" aria-hidden="true">${item.icon}</span>
          <span class="nav-text">${item.label}</span>
        </button>
      `,
    )
    .join("");

  nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page = button.dataset.page;
    resetRoutedState();
    render();
    syncRoute();
  });
}

function attachReferenceJumpHandler() {
  document.addEventListener("click", (event) => {
    const variable = event.target.closest("[data-var-ref]");
    if (variable) {
      event.preventDefault();
      event.stopPropagation();
      showVariablePopover(variable.dataset.varRef);
      return;
    }
    const closeVariable = event.target.closest("[data-close-variable-popover]");
    if (closeVariable) {
      event.preventDefault();
      closeVariablePopover();
      return;
    }
    const link = event.target.closest("[data-jump-page]");
    if (!link) return;
    event.preventDefault();
    event.stopPropagation();
    jumpToReference({
      page: link.dataset.jumpPage,
      entity: link.dataset.jumpEntity,
      search: link.dataset.jumpSearch,
    });
  });
}

function showVariablePopover(ref) {
  closeVariablePopover();
  const info = runtimeVariableRegistry[ref] || {
    kind: ref.split(":")[0] || "变量",
    status: "未登记",
    maskedValue: "未知",
    note: "静态页面没有登记这个变量的当前值；后续接后端后可实时读取并脱敏显示。",
  };
  const popover = document.createElement("div");
  popover.className = "variable-popover";
  popover.id = "variable-popover";
  popover.innerHTML = `
    <div class="variable-popover-head">
      <div>
        <p class="eyebrow">Variable Peek</p>
        <h3>${escapeHtml(ref)}</h3>
      </div>
      <button class="icon-button" type="button" data-close-variable-popover aria-label="关闭变量详情">×</button>
    </div>
    <dl>
      <div>
        <dt>类型</dt>
        <dd>${escapeHtml(info.kind)}</dd>
      </div>
      <div>
        <dt>状态</dt>
        <dd>${escapeHtml(info.status)}</dd>
      </div>
      <div class="variable-value-row">
        <dt>当前值</dt>
        <dd><code>${escapeHtml(info.maskedValue)}</code></dd>
      </div>
      <div>
        <dt>说明</dt>
        <dd>${escapeHtml(info.note)}</dd>
      </div>
    </dl>
  `;
  document.body.appendChild(popover);
}

function closeVariablePopover() {
  document.querySelector("#variable-popover")?.remove();
}

function jumpToReference({ page, entity, search }) {
  state.page = page;
  resetRoutedState();
  state.selectedPathRecordId = null;
  state.selectedPathNodeId = null;

  if (page === "horizontal") {
    state.horizontalEntity = entity === "occurrence" ? "occurrence" : "definition";
    state.horizontalSearch = search || "";
  }
  if (page === "vertical") {
    state.verticalEntity = entity === "occurrence" ? "occurrence" : "definition";
    state.verticalSearch = search || "";
  }
  if (page === "paths") {
    state.pathEntity = entity === "instance" ? "instance" : "definition";
    state.pathSearch = search || "";
    if (/^(path_|pi_)/.test(search || "")) state.selectedPathRecordId = search;
  }
  if (page === "agents") {
    state.agentEntity = entity === "instance" ? "instance" : "definition";
    state.agentSearch = search || "";
  }
  if (page === "sources") {
    state.sourceEntity = entity === "map" ? "map" : "definition";
    state.sourceSearch = search || "";
    state.selectedDataSymbol =
      entity === "map" && symbolDataMapRows.some((row) => row.symbol === search) ? search : null;
  }

  render();
  syncRoute();
  document.querySelector("#page-content")?.scrollIntoView({ block: "start" });
}

function render() {
  const page = pageMeta[state.page];
  document.querySelector("#page-kicker").textContent = page.kicker;
  document.querySelector("#page-title").textContent = page.title;
  document.querySelector("#page-summary").textContent = page.summary;
  document.querySelector(".framework-band").hidden =
    state.page === "horizontal" ||
    state.page === "vertical" ||
    state.page === "paths" ||
    state.page === "agents" ||
    state.page === "sources" ||
    state.page === "spec";

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === state.page);
  });

  const container = document.querySelector("#page-content");
  if (state.page === "horizontal") renderHorizontalEntityPage(container);
  if (state.page === "vertical") renderVerticalEntityPage(container);
  if (state.page === "paths") renderPathPage(container);
  if (state.page === "agents") renderAgentPage(container);
  if (state.page === "sources") renderSourcePage(container);
  if (state.page === "spec") renderSpecPage(container);
}

function renderSpecPage(container) {
  const issues = collectReferenceIssues();
  const referenceCount = referenceFieldRules.reduce((count, rule) => {
    return (
      count +
      getEntityRows(rule.sourcePage, rule.sourceEntity).reduce(
        (innerCount, row) => innerCount + splitReferenceText(row[rule.field] || "").length,
        0,
      )
    );
  }, 0);
  const entityCount =
    Object.values(entityRegistry).reduce((sum, group) => sum + Object.keys(group).length, 0) + 1;

  container.innerHTML = `
    <section class="metrics-grid spec-metrics" aria-label="Spec 指标">
      ${[
        [entityCount, "实体/子实体节点"],
        [referenceFieldRules.length, "受校验的引用字段"],
        [referenceCount, "当前样例引用数量"],
        [issues.length === 0 ? "0" : issues.length, issues.length === 0 ? "悬空引用" : "需要修复的悬空引用"],
      ]
        .map(
          ([value, label]) => `
            <div class="metric-card ${issues.length && label.includes("悬空") ? "metric-alert" : ""}">
              <strong>${escapeHtml(value)}</strong>
              <span>${escapeHtml(label)}</span>
            </div>
          `,
        )
        .join("")}
    </section>

    <section class="entity-panel spec-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>原型实体关系图</h3>
          <p>定义表先沉淀“框架规律”，实例表记录“真实发生”。Path 只负责串联横纵坐标和资金假设，Agent 与数据源作为外部写入/验证能力接入。</p>
        </div>
        <a class="spec-doc-link" href="ENTITY_SPEC.md" target="_blank" rel="noreferrer">打开 spec 文档</a>
      </div>
      ${renderEntityRelationshipDiagram()}
    </section>

    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>外键与写入规则</h3>
          <p>这些字段后续写入时必须先校验目标表存在。中文说明只能放展示字段里，关系字段必须写规范 ID。</p>
        </div>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table spec-rule-table">
          <thead>
            <tr>
              <th><span class="th-cn">来源表</span><code>source_table</code></th>
              <th><span class="th-cn">字段</span><code>field</code></th>
              <th><span class="th-cn">目标表</span><code>target_table</code></th>
              <th><span class="th-cn">基数</span><code>cardinality</code></th>
              <th><span class="th-cn">写入规则</span><code>write_rule</code></th>
            </tr>
          </thead>
          <tbody>${renderReferenceRuleRows()}</tbody>
        </table>
      </div>
    </section>

    ${renderSpecValidationPanel(issues)}
  `;
}

function renderEntityRelationshipDiagram() {
  const nodeMap = Object.fromEntries(specDiagramNodes.map((node) => [node.id, node]));
  return `
    <div class="erd-scroll">
      <div class="erd-canvas" role="img" aria-label="横坐标、纵坐标、Path、Agent、数据源实体关系图">
        <svg class="erd-edges" viewBox="0 0 1080 560" aria-hidden="true">
          <defs>
            <marker id="erd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          ${specDiagramEdges
            .map((edge) => {
              const from = nodeMap[edge.from];
              const to = nodeMap[edge.to];
              if (!from || !to) return "";
              const startX = from.x + 108;
              const startY = from.y + 42;
              const endX = to.x + 108;
              const endY = to.y + 42;
              const controlX = Math.max(44, Math.abs(endX - startX) * 0.25);
              const direction = endX >= startX ? 1 : -1;
              const path = `M ${startX} ${startY} C ${startX + controlX * direction} ${startY}, ${endX - controlX * direction} ${endY}, ${endX} ${endY}`;
              const labelX = (startX + endX) / 2;
              const labelY = (startY + endY) / 2 - 6;
              return `
                <path class="erd-edge-line" d="${path}" marker-end="url(#erd-arrow)"></path>
                <text class="erd-edge-label" x="${labelX}" y="${labelY}">${escapeHtml(edge.label)}</text>
              `;
            })
            .join("")}
        </svg>
        ${specDiagramNodes
          .map((node) => {
            const config = node.code === "symbol_dataset_coverage" ? null : getEntityConfig(node.page, node.entity);
            const count = config ? config.rows.length : symbolDataMapRows.reduce((sum, row) => sum + (row.datasets?.length || 0), 0);
            return `
              <button
                class="erd-node"
                type="button"
                data-jump-page="${escapeAttr(node.page)}"
                data-jump-entity="${escapeAttr(node.entity)}"
                data-jump-search=""
                style="left:${node.x}px; top:${node.y}px;"
                title="跳转到 ${escapeAttr(node.title)}"
              >
                <strong>${escapeHtml(node.title)}</strong>
                <code>${escapeHtml(node.code)}</code>
                <span>${count} 条样例</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderReferenceRuleRows() {
  return referenceFieldRules
    .map(
      (rule) => `
        <tr>
          <td><span class="schema-cn">${escapeHtml(getEntityLabel(rule.sourcePage, rule.sourceEntity))}</span><code>${escapeHtml(getEntityTableName(rule.sourcePage, rule.sourceEntity))}</code></td>
          <td><code>${escapeHtml(rule.field)}</code></td>
          <td><span class="schema-cn">${escapeHtml(getEntityLabel(rule.targetPage, rule.targetEntity))}</span><code>${escapeHtml(getEntityTableName(rule.targetPage, rule.targetEntity))}</code></td>
          <td><span class="cell-pill neutral">${escapeHtml(rule.cardinality)}</span></td>
          <td>${escapeHtml(rule.rule)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSpecValidationPanel(issues) {
  return `
    <section class="entity-panel spec-validation ${issues.length ? "has-issues" : "is-clean"}">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>当前样例数据完整性校验</h3>
          <p>${issues.length ? "下面这些引用没有真实目标，入库前必须补表或改 ID。" : "当前原型样例里的受管引用都能找到目标，不会再把正常链接跳到空表。"}</p>
        </div>
        <span class="cell-pill ${issues.length ? "bad" : "good"}">${issues.length ? `${issues.length} 个问题` : "通过"}</span>
      </div>
      ${
        issues.length
          ? `
            <div class="entity-table-wrap">
              <table class="entity-table spec-issue-table">
                <thead>
                  <tr>
                    <th><span class="th-cn">来源表</span><code>source_table</code></th>
                    <th><span class="th-cn">来源ID</span><code>source_id</code></th>
                    <th><span class="th-cn">字段</span><code>field</code></th>
                    <th><span class="th-cn">引用值</span><code>token</code></th>
                    <th><span class="th-cn">应指向</span><code>expected_table</code></th>
                  </tr>
                </thead>
                <tbody>
                  ${issues
                    .map(
                      (issue) => `
                        <tr>
                          <td><code>${escapeHtml(issue.sourceTable)}</code></td>
                          <td><code>${escapeHtml(issue.sourceId)}</code></td>
                          <td><code>${escapeHtml(issue.field)}</code></td>
                          <td><span class="cell-ref missing">${escapeHtml(issue.token)}</span></td>
                          <td><code>${escapeHtml(issue.expectedTable)}</code></td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
          : `
            <div class="spec-clean-state">
              <strong>校验结果：0 个悬空引用</strong>
              <span>引用字段里的 token 都能在目标实体表中找到真实 ID；后续新增数据也应该先跑同样的校验。</span>
            </div>
          `
      }
    </section>
  `;
}

function renderHorizontalEntityPage(container) {
  const table =
    state.horizontalEntity === "definition"
      ? {
          title: "horizontal_coordinate 定义表",
          desc: "定义某一种横坐标是什么。它是规则模板，不代表某天已经发生。",
          schema: horizontalDefinitionSchema,
          rows: horizontalDefinitionRows,
          visibleColumns: [
            "id",
            "name",
            "category",
            "coordinate_type",
            "time_basis",
            "start_rule",
            "end_rule",
            "known_at_rule",
            "symbol_scope",
            "linked_vertical_types",
            "confidence",
            "status",
          ],
        }
      : {
          title: "horizontal_coordinate_occurrence 实例表",
          desc: "定义表在某一天、某个事件或某个窗口的真实发生实例。回测和实时触发都看这张表。",
          schema: horizontalOccurrenceSchema,
          rows: horizontalOccurrenceRows,
          visibleColumns: [
            "occurrence_id",
            "coordinate_id",
            "trade_date",
            "start_at_local",
            "end_at_local",
            "known_at_utc",
            "activation_state",
            "observed_context",
            "generated_vertical_ids",
            "path_ids",
          ],
        };

  const query = state.horizontalSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row).join(" ").toLowerCase().includes(query);
  });
  table.context = { page: "horizontal", entity: state.horizontalEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "横坐标实体切换",
        dataName: "horizontal-entity",
        current: state.horizontalEntity,
        options: [
          { key: "definition", label: "定义", code: "horizontal_coordinate", desc: "规则模板，回答这是什么横坐标", count: horizontalDefinitionRows.length },
          { key: "occurrence", label: "实例", code: "horizontal_coordinate_occurrence", desc: "某天某窗口真实发生的记录", count: horizontalOccurrenceRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="horizontal-search" type="search" value="${escapeAttr(state.horizontalSearch)}" placeholder="搜索 ID、名称、字段、状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table">
          <thead>
            <tr>${table.visibleColumns.map((col) => renderColumnHeader(col, table.schema)).join("")}${renderRelationHeader()}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>${renderTableCells(row, table.visibleColumns)}${renderRelationCell(row, table.context)}</tr>
                      `,
                    )
                    .join("")
                : `<tr><td colspan="${table.visibleColumns.length + 1}">${table.rows.length ? "没有匹配记录。" : "还没有入库记录。"}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.horizontalEntity === "definition" ? "定义表字段字典" : "实例表字段字典",
      "完整字段解释可展开查看；常用列也可直接 hover 表头。",
    )}
  `;

  container.querySelectorAll("[data-horizontal-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.horizontalEntity = button.dataset.horizontalEntity;
      state.horizontalSearch = "";
      render();
      syncRoute();
    });
  });
  bindSearchInput(container.querySelector("#horizontal-search"), (value) => {
    state.horizontalSearch = value;
  });
}

function renderVerticalEntityPage(container) {
  const table =
    state.verticalEntity === "definition"
      ? {
          title: "vertical_coordinate 定义表",
          desc: "定义某一种纵坐标是什么。它是价格结构模板，不代表某天某标的已经生成了具体价格。",
          schema: verticalDefinitionSchema,
          rows: verticalDefinitionRows,
          visibleColumns: [
            "id",
            "name",
            "category",
            "coordinate_type",
            "price_domain",
            "computation_method",
            "source_window_rule",
            "required_horizontal_ids",
            "valid_until_rule",
            "invalidated_by",
            "confidence",
            "status",
          ],
        }
      : {
          title: "vertical_coordinate_occurrence 实例表",
          desc: "定义表在某个标的、某个交易日、某个窗口里计算出的具体价格/权利金/IV。回测和实时验证都看这张表。",
          schema: verticalOccurrenceSchema,
          rows: verticalOccurrenceRows,
          visibleColumns: [
            "occurrence_id",
            "coordinate_id",
            "symbol",
            "trade_date",
            "value",
            "value_unit",
            "source_window_start_utc",
            "source_window_end_utc",
            "horizontal_occurrence_ids",
            "invalidation_state",
            "path_ids",
          ],
        };

  const query = state.verticalSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row).join(" ").toLowerCase().includes(query);
  });
  table.context = { page: "vertical", entity: state.verticalEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "纵坐标实体切换",
        dataName: "vertical-entity",
        current: state.verticalEntity,
        options: [
          { key: "definition", label: "定义", code: "vertical_coordinate", desc: "价格结构模板，回答这个价怎么来", count: verticalDefinitionRows.length },
          { key: "occurrence", label: "实例", code: "vertical_coordinate_occurrence", desc: "某标的某窗口算出的具体值", count: verticalOccurrenceRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="vertical-search" type="search" value="${escapeAttr(state.verticalSearch)}" placeholder="搜索 ID、标的、字段、状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table">
          <thead>
            <tr>${table.visibleColumns.map((col) => renderColumnHeader(col, table.schema)).join("")}${renderRelationHeader()}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>${renderTableCells(row, table.visibleColumns)}${renderRelationCell(row, table.context)}</tr>
                      `,
                    )
                    .join("")
                : `<tr><td colspan="${table.visibleColumns.length + 1}">${table.rows.length ? "没有匹配记录。" : "还没有入库记录。"}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.verticalEntity === "definition" ? "定义表字段字典" : "实例表字段字典",
      "来源窗口、有效期和失效条件是纵坐标的核心；常用列可 hover 表头。",
    )}
  `;

  container.querySelectorAll("[data-vertical-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.verticalEntity = button.dataset.verticalEntity;
      state.verticalSearch = "";
      render();
      syncRoute();
    });
  });
  bindSearchInput(container.querySelector("#vertical-search"), (value) => {
    state.verticalSearch = value;
  });
}

function getSchemaDescription(schema, field) {
  return (schema.find(([name]) => name === field) || [field, ""])[1] || "";
}

function getFieldLabel(schema, field) {
  if (fieldLabelMap[field]) return fieldLabelMap[field];
  const desc = getSchemaDescription(schema, field);
  const label = desc.split(/[：，。,]/)[0].trim();
  return label && label.length <= 10 ? label : field;
}

function renderColumnHeader(field, schema) {
  const label = getFieldLabel(schema, field);
  const desc = getSchemaDescription(schema, field) || field;
  return `
    <th title="${escapeAttr(desc)}" data-tooltip="${escapeAttr(desc)}">
      <span class="th-cn">${escapeHtml(label)}</span>
      <code>${escapeHtml(field)}</code>
    </th>
  `;
}

function renderRelationHeader() {
  return `
    <th class="relation-column" title="这条记录能跳转到哪些上游、下游或绑定对象。" data-tooltip="这条记录能跳转到哪些上游、下游或绑定对象。">
      <span class="th-cn">关系</span>
      <code>links</code>
    </th>
  `;
}

function renderSchemaRows(schema) {
  return schema
    .map(
      ([field, desc]) => `
        <tr>
          <td>
            <span class="schema-cn">${escapeHtml(getFieldLabel(schema, field))}</span>
            <code>${escapeHtml(field)}</code>
          </td>
          <td>${escapeHtml(desc)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSchemaDetails(table, heading, desc) {
  return `
    <details class="entity-panel schema-details">
      <summary>
        <span>
          <strong>${heading}</strong>
          <small>${desc}</small>
        </span>
        <em>${table.schema.length} 个字段</em>
      </summary>
      <div class="entity-table-wrap">
        <table class="entity-table schema-table">
          <thead>
            <tr>
              <th>中文 / field</th>
              <th>含义 / meaning</th>
            </tr>
          </thead>
          <tbody>${renderSchemaRows(table.schema)}</tbody>
        </table>
      </div>
    </details>
  `;
}

function renderEntitySwitcher({ ariaLabel, dataName, current, options }) {
  return `
    <div class="entity-switcher" aria-label="${escapeAttr(ariaLabel)}">
      ${options
        .map(
          (option) => `
            <button type="button" class="entity-switch ${current === option.key ? "is-active" : ""}" data-${dataName}="${escapeAttr(option.key)}">
              <span>
                <strong>${option.label}</strong>
                <code>${option.code}</code>
              </span>
              <small>${option.desc}</small>
              <em>${option.count} 条</em>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTableCells(row, columns) {
  return columns.map((col) => `<td data-field="${escapeAttr(col)}">${formatCell(row[col], col)}</td>`).join("");
}

function renderRelationCell(row, context) {
  const relations = getRowRelations(row, context);
  return `<td class="relation-cell" data-field="links">${renderRelationLinks(relations)}</td>`;
}

function renderRelationLinks(relations) {
  if (!relations.length) return '<span class="muted-cell">无直接关系</span>';
  return `
    <span class="cell-ref-list relation-ref-list">
      ${relations.map(renderRelationLink).join("")}
    </span>
  `;
}

function renderRelationLink(relation) {
  if (relation.missing) {
    return `
      <span
        class="cell-ref relation-ref missing ${relation.tone || ""}"
        title="${escapeAttr(relation.title || `暂无可跳转目标：${relation.search || relation.label}`)}"
      >${escapeHtml(relation.label)}</span>
    `;
  }
  if (relation.variableRef) {
    return `
      <button
        class="cell-ref relation-ref variable ${relation.tone || ""}"
        type="button"
        data-var-ref="${escapeAttr(relation.variableRef)}"
        title="${escapeAttr(relation.title || `查看 ${relation.variableRef} 的脱敏当前值`)}"
      >${escapeHtml(relation.label)}</button>
    `;
  }
  return `
    <a
      class="cell-ref relation-ref ${relation.tone || ""}"
      href="#${escapeAttr(relation.page)}"
      data-jump-page="${escapeAttr(relation.page)}"
      data-jump-entity="${escapeAttr(relation.entity)}"
      data-jump-search="${escapeAttr(relation.search)}"
      title="${escapeAttr(relation.title || `跳转到 ${relation.search}`)}"
    >${escapeHtml(relation.label)}</a>
  `;
}

function makeRelation(label, page, entity, search, title = "", tone = "") {
  const target = { page, entity, search };
  const missing = !targetHasMatches(target);
  return { label, page, entity, search, title, tone, missing };
}

function makeMissingRelation(label, search, title = "", tone = "") {
  return { label, search, title, tone, missing: true };
}

function makeVariableRelation(label, variableRef, title = "", tone = "secret") {
  return { label, variableRef, title, tone };
}

function extractVariableRefs(text = "") {
  return Array.from(String(text).matchAll(/\b(?:env|config|local):[^\s,，、]+/g)).map((match) => match[0]);
}

function appendVariablePeekRelations(relations, labelPrefix, text, tone = "secret") {
  extractVariableRefs(text).forEach((ref) => {
    relations.push(makeVariableRelation(labelPrefix, ref, `查看 ${ref} 的脱敏当前值`, tone));
  });
}

function appendTokenRelations(relations, labelPrefix, tokensText, field, tone = "") {
  splitReferenceText(tokensText || "").forEach((token) => {
    const target = inferReferenceTarget(token, field);
    if (!target) return;
    if (!targetIdExists(target)) {
      relations.push(makeMissingRelation(`${labelPrefix}:未建 ${token}`, token, `未找到 ${token} 的目标记录`, tone));
      return;
    }
    relations.push(makeRelation(`${labelPrefix}:${token}`, target.page, target.entity, target.search, `跳转到 ${token}`, tone));
  });
}

function getRowRelations(row, context = {}) {
  const relations = [];
  if (context.page === "horizontal" && context.entity === "definition") {
    relations.push(makeRelation("看实例", "horizontal", "occurrence", row.id, "查看这个横坐标定义的发生实例", "forward"));
    relations.push(makeRelation("相关Path", "paths", "definition", row.id, "查看引用这个横坐标的 Path", "path"));
    appendTokenRelations(relations, "纵坐标", row.linked_vertical_types, "linked_vertical_types", "cross");
  }
  if (context.page === "horizontal" && context.entity === "occurrence") {
    relations.push(makeRelation("回定义", "horizontal", "definition", row.coordinate_id, "回到横坐标定义", "back"));
    appendTokenRelations(relations, "生成纵", row.generated_vertical_ids, "generated_vertical_ids", "cross");
    appendTokenRelations(relations, "Path", row.path_ids, "path_ids", "path");
  }
  if (context.page === "vertical" && context.entity === "definition") {
    relations.push(makeRelation("看实例", "vertical", "occurrence", row.id, "查看这个纵坐标定义的发生实例", "forward"));
    relations.push(makeRelation("相关Path", "paths", "definition", row.id, "查看引用这个纵坐标的 Path", "path"));
    appendTokenRelations(relations, "依赖横", row.required_horizontal_ids, "required_horizontal_ids", "cross");
  }
  if (context.page === "vertical" && context.entity === "occurrence") {
    relations.push(makeRelation("回定义", "vertical", "definition", row.coordinate_id, "回到纵坐标定义", "back"));
    appendTokenRelations(relations, "横实例", row.horizontal_occurrence_ids, "horizontal_occurrence_ids", "cross");
    appendTokenRelations(relations, "Path", row.path_ids, "path_ids", "path");
  }
  if (context.page === "paths" && context.entity === "definition") {
    relations.push(makeRelation("看实例", "paths", "instance", row.id, "查看这个 Path 定义的实盘实例", "forward"));
    appendTokenRelations(relations, "横定义", row.horizontal_definition_ids, "horizontal_definition_ids", "cross");
    appendTokenRelations(relations, "纵定义", row.vertical_definition_ids, "vertical_definition_ids", "cross");
  }
  if (context.page === "paths" && context.entity === "instance") {
    relations.push(makeRelation("回定义", "paths", "definition", row.path_definition_id, "回到 Path 定义", "back"));
    appendTokenRelations(relations, "横实例", row.horizontal_occurrence_ids, "horizontal_occurrence_ids", "cross");
    appendTokenRelations(relations, "纵实例", row.vertical_occurrence_ids, "vertical_occurrence_ids", "cross");
  }
  if (context.page === "agents" && context.entity === "definition") {
    appendVariablePeekRelations(relations, "密钥", row.credential_ref, "secret");
    relations.push(makeRelation("绑定Agent", "agents", "instance", row.id, "查看使用这个模型定义的 Agent 实例", "forward"));
  }
  if (context.page === "agents" && context.entity === "instance") {
    relations.push(makeRelation("模型定义", "agents", "definition", row.llm_definition_id, "回到绑定的大模型定义", "back"));
  }
  if (context.page === "sources" && context.entity === "definition") {
    appendVariablePeekRelations(relations, "端点", row.endpoint_ref, "secret");
    appendVariablePeekRelations(relations, "鉴权", row.auth_ref, "secret");
    relations.push(makeRelation("覆盖标的", "sources", "map", row.id, "查看使用这个源头的数据地图记录", "forward"));
  }
  if (context.page === "sources" && context.entity === "map") {
    relations.push(makeRelation("查看详情", "sources", "map", row.symbol, "打开这个标的数据详情", "forward"));
    appendTokenRelations(relations, "源头", row.primary_sources, "primary_sources", "back");
  }
  return relations;
}

function formatCell(value, field = "") {
  const text = value === undefined || value === null ? "" : String(value);
  if (!text) return '<span class="muted-cell">null</span>';
  if (isVariableField(field)) return renderVariableCell(text);
  if (isReferenceField(field)) return renderReferenceCell(text, field);
  const pillFields = new Set([
    "status",
    "confidence",
    "activation_state",
    "quality_status",
    "human_review_state",
    "invalidation_state",
    "tool_calling",
    "json_mode",
    "streaming",
    "price_data",
    "trade_data",
    "nbbo_data",
    "snapshot_data",
    "option_chain_data",
    "option_trade_quote_data",
  ]);
  if (pillFields.has(field) && text.length <= 28 && !text.includes(",")) {
    const tone = /active|ready|启用|核心|高频|yes|partial|confirmed|已验证/i.test(text)
      ? "good"
      : /planned|候选|待验证|watching|unknown|pending/i.test(text)
        ? "warn"
        : /failed|deprecated|废弃|invalidated|stale/i.test(text)
          ? "bad"
          : "neutral";
    return `<span class="cell-pill ${tone}">${escapeHtml(text)}</span>`;
  }
  return escapeHtml(text);
}

function isVariableField(field) {
  return new Set(["credential_ref", "auth_ref", "api_base_ref", "endpoint_ref"]).has(field);
}

function renderVariableCell(text) {
  const variablePattern = /\b(?:env|config|local):[^\s,，、]+/g;
  let html = "";
  let lastIndex = 0;
  let hasVariable = false;
  for (const match of text.matchAll(variablePattern)) {
    hasVariable = true;
    html += escapeHtml(text.slice(lastIndex, match.index));
    html += renderVariableRef(match[0]);
    lastIndex = match.index + match[0].length;
  }
  html += escapeHtml(text.slice(lastIndex));
  return hasVariable ? html : escapeHtml(text);
}

function renderVariableRef(ref) {
  const info = runtimeVariableRegistry[ref];
  const tone = info?.status === "已登记" || info?.status === "已知" || info?.status === "本地" ? "good" : "warn";
  return `
    <button
      class="var-ref ${tone}"
      type="button"
      data-var-ref="${escapeAttr(ref)}"
      title="查看 ${escapeAttr(ref)} 的脱敏当前值"
    >${escapeHtml(ref)}</button>
  `;
}

function isReferenceField(field) {
  return new Set([
    "coordinate_id",
    "linked_vertical_types",
    "generated_vertical_ids",
    "path_ids",
    "required_horizontal_ids",
    "horizontal_occurrence_ids",
    "vertical_occurrence_ids",
    "horizontal_definition_ids",
    "vertical_definition_ids",
    "path_definition_id",
    "llm_definition_id",
    "primary_sources",
  ]).has(field);
}

function splitReferenceText(text) {
  return text
    .split(/\s*(?:,|，|、|\/)\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferReferenceTarget(token, field) {
  if (/^hco_/.test(token)) return { page: "horizontal", entity: "occurrence", search: token };
  if (/^hc_/.test(token)) return { page: "horizontal", entity: "definition", search: token };
  if (/^vco_/.test(token)) return { page: "vertical", entity: "occurrence", search: token };
  if (/^vc_/.test(token)) return { page: "vertical", entity: "definition", search: token };
  if (/^pi_/.test(token)) return { page: "paths", entity: "instance", search: token };
  if (/^path_/.test(token)) return { page: "paths", entity: "definition", search: token };
  if (/^llm_/.test(token)) return { page: "agents", entity: "definition", search: token };
  if (/^src_/.test(token)) return { page: "sources", entity: "definition", search: token };
  if (field === "linked_vertical_types" || field === "generated_vertical_ids" || field === "vertical_definition_ids") {
    return { page: "vertical", entity: "definition", search: token };
  }
  if (field === "vertical_occurrence_ids") {
    return { page: "vertical", entity: "occurrence", search: token };
  }
  if (field === "required_horizontal_ids" || field === "horizontal_definition_ids") {
    return { page: "horizontal", entity: "definition", search: token };
  }
  if (field === "horizontal_occurrence_ids") {
    return { page: "horizontal", entity: "occurrence", search: token };
  }
  if (field === "path_ids" || field === "path_definition_id") {
    return { page: "paths", entity: "definition", search: token };
  }
  if (field === "llm_definition_id") {
    return { page: "agents", entity: "definition", search: token };
  }
  if (field === "primary_sources") {
    return { page: "sources", entity: "definition", search: token };
  }
  return null;
}

function renderReferenceCell(text, field) {
  const tokens = splitReferenceText(text);
  if (!tokens.length) return escapeHtml(text);
  return `
    <span class="cell-ref-list">
      ${tokens
        .map((token) => {
          const target = inferReferenceTarget(token, field);
          if (!target) return `<span class="cell-ref muted">${escapeHtml(token)}</span>`;
          if (!targetIdExists(target)) {
            return `<span class="cell-ref missing" title="未找到目标记录：${escapeAttr(target.search)}">${escapeHtml(token)}</span>`;
          }
          return `
            <a
              class="cell-ref"
              href="#${escapeAttr(target.page)}"
              data-jump-page="${escapeAttr(target.page)}"
              data-jump-entity="${escapeAttr(target.entity)}"
              data-jump-search="${escapeAttr(target.search)}"
              title="跳转到 ${escapeAttr(target.search)}"
            >${escapeHtml(token)}</a>
          `;
        })
        .join("")}
    </span>
  `;
}

function renderMetrics(pageKey) {
  return `
    <section class="metrics-grid" aria-label="关键指标">
      ${metrics[pageKey]
        .map(
          ([value, label]) => `
            <div class="metric-card">
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderCoordinatePage(container, pageKey, entries) {
  const groups = ["全部", ...Array.from(new Set(entries.map((entry) => entry.group)))];
  const filtered = entries.filter((entry) => {
    const matchesGroup = state.filter === "全部" || entry.group === state.filter;
    const query = state.search.trim().toLowerCase();
    const haystack = [entry.label, entry.group, entry.timeBasis, entry.source, entry.summary, ...entry.fields]
      .join(" ")
      .toLowerCase();
    return matchesGroup && (!query || haystack.includes(query));
  });
  const selected = getSelectedEntry(filtered, entries);

  container.innerHTML = `
    ${renderMetrics(pageKey)}
    <section class="split-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <h3>${pageKey === "horizontal" ? "时间与事件坐标" : "价格结构坐标"}</h3>
            <p>${pageKey === "horizontal" ? "先把时间口径、事件阶段和 lead-lag 关系标准化，再让 path 使用。" : "先把价格来源、有效窗口和失效条件标准化，再映射到不同标的。"}</p>
          </div>
          <span class="status-pill">${filtered.length} / ${entries.length}</span>
        </div>
        <div class="toolbar">
          <input class="search-box" id="coord-search" type="search" value="${escapeAttr(state.search)}" placeholder="搜索坐标、字段、来源" />
          <div class="chip-row">
            ${groups
              .map(
                (group) => `
                  <button type="button" class="chip ${state.filter === group ? "is-active" : ""}" data-filter="${escapeAttr(group)}">${group}</button>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="item-list">
          ${
            filtered.length
              ? filtered
                  .map((entry) => renderCoordinateRow(entry, selected.label === entry.label))
                  .join("")
              : '<div class="empty-state">还没有入库坐标。后续按理论验证后再逐条加入。</div>'
          }
        </div>
      </div>
      ${renderCoordinateDetail(selected, pageKey)}
    </section>
    ${renderSchemaPanel(pageKey)}
  `;

  bindSearchInput(container.querySelector("#coord-search"), (value) => {
    state.search = value;
    state.selectedId = null;
  });
  container.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      state.selectedId = null;
      render();
      syncRoute();
    });
  });
  container.querySelectorAll("[data-entry]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.entry;
      render();
      syncRoute();
    });
  });
}

function getSelectedEntry(filtered, entries) {
  const pool = filtered.length ? filtered : entries;
  return pool.find((entry) => entry.label === state.selectedId) || pool[0];
}

function renderCoordinateRow(entry, selected) {
  return `
    <button class="item-row ${selected ? "is-selected" : ""}" data-entry="${escapeAttr(entry.label)}" type="button">
      <div>
        <span class="item-title">${entry.label}</span>
        <div class="tag-stack">
          <span class="tag accent">${entry.group}</span>
          <span class="tag blue">${entry.confidence}</span>
        </div>
      </div>
      <p class="item-desc">${entry.summary}</p>
      <div class="item-meta">
        <strong>时间口径</strong><br />
        ${entry.timeBasis}
      </div>
    </button>
  `;
}

function renderCoordinateDetail(entry, pageKey) {
  return `
    <aside class="detail-pane" aria-label="坐标详情">
      <p class="eyebrow">${pageKey === "horizontal" ? "Horizontal Coordinate" : "Vertical Coordinate"}</p>
      <h3>${entry.label}</h3>
      <p class="item-desc">${entry.summary}</p>
      <div class="detail-grid">
        <div class="detail-block">
          <strong>来源</strong>
          <p>${entry.source}</p>
        </div>
        <div class="detail-block">
          <strong>时间/窗口</strong>
          <p>${entry.timeBasis}</p>
        </div>
        <div class="detail-block">
          <strong>用途</strong>
          <p>${entry.usage}</p>
        </div>
      </div>
      <div class="detail-block" style="margin-top: 12px;">
        <strong>建议字段</strong>
        <p>${entry.fields.map((field) => `<code>${field}</code>`).join(" · ")}</p>
      </div>
    </aside>
  `;
}

function renderSchemaPanel(pageKey) {
  const rows =
    pageKey === "horizontal"
      ? [
          ["time_basis", "UTC+8 / ET / local_market / relative，必须保留原始口径。"],
          ["known_at", "未来横坐标必须标记当时是否已经知道，避免未来函数。"],
          ["event_context", "财报、讲话、FOMC、节假日、结算日等事件元数据。"],
          ["lead_lag_minutes", "BTC、亚洲市场或龙头股对目标标的的领先/滞后时间。"],
        ]
      : [
          ["price_type", "低点、前高、缺口、强平低点、IV、权利金等价格类型。"],
          ["source_window", "这个价格从哪个时间窗口产生，不能只保存数字。"],
          ["valid_until", "价格锚点有效到什么时候或哪个事件前。"],
          ["invalidated_by", "被什么行为击穿后失效，例如放量跌破或事件反转。"],
        ];

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>${pageKey === "horizontal" ? "横坐标入库字段" : "纵坐标入库字段"}</h3>
          <p>后续接数据库时，这些字段会变成最小 schema。页面当前先固定语言，避免 Agent 各说各话。</p>
        </div>
      </div>
      <div class="schema-list">
        ${rows
          .map(
            ([field, desc]) => `
              <div class="schema-line">
                <code>${field}</code>
                <span class="field-line">${desc}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderPathPage(container) {
  const table = getPathTableConfig();
  const query = state.pathSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row).join(" ").toLowerCase().includes(query);
  });
  const selectedRecord = table.rows.find((row) => getPathRecordId(row) === state.selectedPathRecordId);
  table.context = { page: "paths", entity: state.pathEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "Path 实体切换",
        dataName: "path-entity",
        current: state.pathEntity,
        options: [
          { key: "definition", label: "定义", code: "path_definition", desc: "转移规则、资金假设和验证计划", count: pathDefinitionRows.length },
          { key: "instance", label: "实例", code: "path_instance", desc: "实盘走过的节点和结果回放", count: pathInstanceRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="path-search" type="search" value="${escapeAttr(state.pathSearch)}" placeholder="搜索 ID、标的、节点、状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录${rows.length ? "；点击一行打开右侧画板抽屉" : ""}</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table path-entity-table">
          <thead>
            <tr>${table.visibleColumns.map((col) => renderColumnHeader(col, table.schema)).join("")}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr class="clickable-row ${getPathRecordId(row) === state.selectedPathRecordId ? "is-selected" : ""}" data-path-record="${escapeAttr(getPathRecordId(row))}" tabindex="0">
                          ${renderTableCells(row, table.visibleColumns)}
                        </tr>
                      `,
                    )
                    .join("")
                : `<tr><td colspan="${table.visibleColumns.length}">${table.rows.length ? "没有匹配记录。" : "还没有入库记录。"}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.pathEntity === "definition" ? "定义表字段字典" : "实例表字段字典",
      "Path 是横坐标和纵坐标之间的状态机；点击列表行进入画板。",
    )}
    ${selectedRecord ? renderPathDrawer(selectedRecord) : ""}
  `;

  attachPathPageEvents(container);
  drawPathEdges(container);
}

function getPathTableConfig() {
  return state.pathEntity === "definition"
    ? {
        title: "path_definition 定义表",
        desc: "定义一条 path 的转移条件、资金假设和验证计划；节点链和横纵坐标引用在抽屉画板里查看。",
        schema: pathDefinitionSchema,
        rows: pathDefinitionRows,
        visibleColumns: [
          "id",
          "name",
          "path_family",
          "status",
          "discovered_by",
          "flow_hypothesis",
          "invalidation_rule",
          "confidence",
        ],
      }
    : {
        title: "path_instance 实例表",
        desc: "定义表在实盘某个交易日或事件中实际发生的路径、当前节点、结果和人工复盘状态。",
        schema: pathInstanceSchema,
        rows: pathInstanceRows,
        visibleColumns: [
          "instance_id",
          "path_definition_id",
          "symbols",
          "trade_date",
          "activation_state",
          "current_node_id",
          "horizontal_occurrence_ids",
          "vertical_occurrence_ids",
          "outcome_label",
          "return_30m",
          "return_1h",
          "return_close",
          "human_review_state",
        ],
      };
}

function getPathRecordId(record) {
  return state.pathEntity === "definition" ? record.id : record.instance_id;
}

function getPathRecordTitle(record) {
  return state.pathEntity === "definition" ? record.name : record.instance_id;
}

function renderPathDrawer(record) {
  const canvasConfig = getPathCanvasConfig();
  const selectedNode = getSelectedPathNode(canvasConfig.nodes);
  const title = getPathRecordTitle(record);
  return `
    <div class="drawer-backdrop" data-close-path-drawer></div>
    <aside class="path-drawer" aria-label="Path 画板抽屉">
      <div class="path-drawer-header">
        <div>
          <p class="eyebrow">${state.pathEntity === "definition" ? "path_definition" : "path_instance"}</p>
          <h3>${title}</h3>
          <p>${state.pathEntity === "definition" ? record.description : record.outcome_label}</p>
        </div>
        <button class="icon-button" type="button" data-close-path-drawer aria-label="关闭抽屉">×</button>
      </div>
      <div class="path-drawer-body">
        <div class="path-record-summary">
          ${renderPathRecordSummary(record)}
        </div>
        <div class="path-canvas-shell">
          <div class="path-canvas-header">
            <strong>${state.pathEntity === "definition" ? "定义画板" : "实例回放画板"}</strong>
            <span>拖动节点可调整视图位置</span>
          </div>
          <div class="path-canvas" id="path-canvas">
            <svg class="path-edges" aria-hidden="true"></svg>
            ${canvasConfig.nodes.map(renderPathCanvasNode).join("")}
          </div>
        </div>
        <aside class="path-inspector" aria-label="Path 节点详情">
          ${renderPathInspectorContent(selectedNode)}
        </aside>
      </div>
    </aside>
  `;
}

function renderPathRecordSummary(record) {
  const rows =
    state.pathEntity === "definition"
      ? [
          ["状态", record.status],
          ["Path 家族", record.path_family],
          ["资金假设", record.flow_hypothesis],
          ["失效条件", record.invalidation_rule],
        ]
      : [
          ["状态", record.activation_state],
          ["标的", record.symbols],
          ["当前节点", record.current_node_id],
          ["人工复盘", record.human_review_state],
        ];

  return rows
    .map(
      ([label, value]) => `
        <div>
          <strong>${label}</strong>
          <span>${formatCell(value)}</span>
        </div>
      `,
    )
    .join("");
}

function getPathCanvasConfig() {
  return state.pathEntity === "definition"
    ? { nodes: pathCanvasDefinitions, edges: pathCanvasDefinitionEdges }
    : { nodes: pathCanvasInstances, edges: pathCanvasInstanceEdges };
}

function getSelectedPathNode(nodes) {
  return nodes.find((node) => node.id === state.selectedPathNodeId) || nodes[0];
}

function renderPathCanvasNode(node) {
  const position = getPathNodePosition(node);
  return `
    <button class="canvas-node ${node.kind}" type="button" data-path-node="${node.id}" style="left: ${position.x}px; top: ${position.y}px;">
      <span>${node.seq}</span>
      <strong>${node.title}</strong>
      <small>${node.meta}</small>
    </button>
  `;
}

function getPathNodePosition(node) {
  return state.pathCanvasPositions[state.pathEntity][node.id] || { x: node.x, y: node.y };
}

function attachPathPageEvents(container) {
  container.querySelectorAll("[data-path-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pathEntity = button.dataset.pathEntity;
      state.pathSearch = "";
      state.selectedPathRecordId = null;
      state.selectedPathNodeId = null;
      render();
      syncRoute();
    });
  });

  bindSearchInput(container.querySelector("#path-search"), (value) => {
    state.pathSearch = value;
  });

  const canvas = container.querySelector("#path-canvas");
  container.querySelectorAll("[data-path-record]").forEach((row) => {
    const openRecord = () => {
      state.selectedPathRecordId = row.dataset.pathRecord;
      state.selectedPathNodeId = null;
      render();
      syncRoute();
    };
    row.addEventListener("click", openRecord);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRecord();
      }
    });
  });

  container.querySelectorAll("[data-close-path-drawer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPathRecordId = null;
      state.selectedPathNodeId = null;
      render();
      syncRoute();
    });
  });

  if (!canvas) return;
  let drag = null;

  canvas.querySelectorAll("[data-path-node]").forEach((nodeEl) => {
    nodeEl.addEventListener("pointerdown", (event) => {
      const nodeId = nodeEl.dataset.pathNode;
      const node = getPathCanvasConfig().nodes.find((item) => item.id === nodeId);
      const position = getPathNodePosition(node);
      state.selectedPathNodeId = nodeId;
      drag = {
        nodeId,
        startX: event.clientX,
        startY: event.clientY,
        originalX: position.x,
        originalY: position.y,
      };
      nodeEl.setPointerCapture(event.pointerId);
      nodeEl.classList.add("is-dragging");
      renderPathInspector(container);
      syncRoute({ replace: true });
    });

    nodeEl.addEventListener("pointermove", (event) => {
      if (!drag || drag.nodeId !== nodeEl.dataset.pathNode) return;
      const nextX = Math.max(12, Math.min(900, drag.originalX + event.clientX - drag.startX));
      const nextY = Math.max(12, Math.min(360, drag.originalY + event.clientY - drag.startY));
      state.pathCanvasPositions[state.pathEntity][drag.nodeId] = { x: nextX, y: nextY };
      nodeEl.style.left = `${nextX}px`;
      nodeEl.style.top = `${nextY}px`;
      drawPathEdges(container);
    });

    nodeEl.addEventListener("pointerup", (event) => {
      if (!drag) return;
      nodeEl.releasePointerCapture(event.pointerId);
      nodeEl.classList.remove("is-dragging");
      drag = null;
    });
  });
}

function renderPathInspector(container) {
  const selectedNode = getSelectedPathNode(getPathCanvasConfig().nodes);
  const inspector = container.querySelector(".path-inspector");
  inspector.innerHTML = renderPathInspectorContent(selectedNode);
}

function renderPathInspectorContent(selectedNode) {
  const coordinateLinks = renderPathNodeCoordinateLinks(selectedNode);
  return `
    <p class="eyebrow">${state.pathEntity === "definition" ? "Path Node" : "Observed Node"}</p>
    <h3>${selectedNode.title}</h3>
    <div class="tag-stack">
      <span class="tag accent">${selectedNode.seq}</span>
      <span class="tag blue">${selectedNode.kind}</span>
    </div>
    <dl>
      <div>
        <dt>引用/状态</dt>
        <dd>${selectedNode.meta}</dd>
      </div>
      <div>
        <dt>说明</dt>
        <dd>${selectedNode.detail}</dd>
      </div>
    </dl>
    ${coordinateLinks}
  `;
}

function renderPathNodeCoordinateLinks(node) {
  const groups = [
    {
      title: "横坐标定义",
      tokens: node.horizontalIds,
      field: "horizontal_definition_ids",
      labelPrefix: "横定义",
    },
    {
      title: "纵坐标定义",
      tokens: node.verticalIds,
      field: "vertical_definition_ids",
      labelPrefix: "纵定义",
    },
    {
      title: "横坐标实例",
      tokens: node.horizontalOccurrenceIds,
      field: "horizontal_occurrence_ids",
      labelPrefix: "横实例",
    },
    {
      title: "纵坐标实例",
      tokens: node.verticalOccurrenceIds,
      field: "vertical_occurrence_ids",
      labelPrefix: "纵实例",
    },
  ]
    .map((group) => {
      const relations = [];
      appendTokenRelations(relations, group.labelPrefix, group.tokens, group.field, "cross");
      if (!relations.length) return "";
      return `
        <div class="node-link-group">
          <dt>${group.title}</dt>
          <dd>${renderRelationLinks(relations)}</dd>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  if (!groups) {
    return `
      <div class="node-link-panel">
        <strong>坐标跳转</strong>
        <span class="muted-cell">这个节点还没有绑定横纵坐标。</span>
      </div>
    `;
  }

  return `
    <div class="node-link-panel">
      <strong>坐标跳转</strong>
      <dl>${groups}</dl>
    </div>
  `;
}

function drawPathEdges(container) {
  const { nodes, edges } = getPathCanvasConfig();
  const svg = container.querySelector(".path-edges");
  if (!svg) return;
  const nodeWidth = 190;
  const nodeHeight = 86;
  svg.innerHTML = edges
    .map((edge, index) => {
      const from = nodes.find((node) => node.id === edge.from);
      const to = nodes.find((node) => node.id === edge.to);
      if (!from || !to) return "";
      const fromPosition = getPathNodePosition(from);
      const toPosition = getPathNodePosition(to);
      const startX = fromPosition.x + nodeWidth;
      const startY = fromPosition.y + nodeHeight / 2;
      const endX = toPosition.x;
      const endY = toPosition.y + nodeHeight / 2;
      const control = Math.max(60, Math.abs(endX - startX) * 0.45);
      const path = `M ${startX} ${startY} C ${startX + control} ${startY}, ${endX - control} ${endY}, ${endX} ${endY}`;
      const labelX = (startX + endX) / 2;
      const labelY = (startY + endY) / 2 - 8;
      return `
        <path class="edge-line" d="${path}" marker-end="url(#arrow-${state.pathEntity})"></path>
        <text class="edge-label" x="${labelX}" y="${labelY}">${escapeHtml(edge.label)}</text>
        ${index === 0 ? renderArrowMarker() : ""}
      `;
    })
    .join("");
}

function renderArrowMarker() {
  return `
    <defs>
      <marker id="arrow-${state.pathEntity}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z"></path>
      </marker>
    </defs>
  `;
}

function renderAgentPage(container) {
  const table =
    state.agentEntity === "definition"
      ? {
          title: "llm_api_definition 定义表",
          desc: "定义各个大模型 API 怎么接入：供应商、模型、协议、鉴权、能力、默认参数和密钥引用。",
          schema: llmApiDefinitionSchema,
          rows: llmApiDefinitionRows,
          visibleColumns: [
            "id",
            "provider",
            "model_name",
            "api_protocol",
            "credential_ref",
            "modalities",
            "tool_calling",
            "json_mode",
            "max_output_tokens",
            "status",
          ],
        }
      : {
          title: "ai_agent_instance 实例表",
          desc: "Agent 实例 = 大模型定义 + 特定 prompt + 特定 workflow + 触发器 + 输入输出权限。",
          schema: aiAgentInstanceSchema,
          rows: aiAgentInstanceRows,
          visibleColumns: [
            "agent_id",
            "name",
            "role_type",
            "llm_definition_id",
            "prompt_id",
            "workflow_type",
            "workflow_ref",
            "trigger_type",
            "schedule_rule",
            "input_sources",
            "output_targets",
            "status",
          ],
        };

  const query = state.agentSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row).join(" ").toLowerCase().includes(query);
  });
  table.context = { page: "agents", entity: state.agentEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "AI Agent 实体切换",
        dataName: "agent-entity",
        current: state.agentEntity,
        options: [
          { key: "definition", label: "模型接入定义", code: "llm_api_definition", desc: "供应商、模型能力、密钥引用", count: llmApiDefinitionRows.length },
          { key: "instance", label: "Agent实例", code: "ai_agent_instance", desc: "模型 + prompt + workflow + 权限", count: aiAgentInstanceRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="agent-search" type="search" value="${escapeAttr(state.agentSearch)}" placeholder="搜索模型、Agent、workflow、状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table agent-entity-table">
          <thead>
            <tr>${table.visibleColumns.map((col) => renderColumnHeader(col, table.schema)).join("")}${renderRelationHeader()}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>${renderTableCells(row, table.visibleColumns)}${renderRelationCell(row, table.context)}</tr>
                      `,
                    )
                    .join("")
                : `<tr><td colspan="${table.visibleColumns.length + 1}">没有匹配记录。</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.agentEntity === "definition" ? "模型接入字段字典" : "Agent 实例字段字典",
      state.agentEntity === "definition" ? "定义表只管 API 能力和接入方式；不展示明文 token。" : "实例表绑定模型、prompt、workflow、触发器和权限。",
    )}
  `;

  container.querySelectorAll("[data-agent-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.agentEntity = button.dataset.agentEntity;
      state.agentSearch = "";
      render();
      syncRoute();
    });
  });
  bindSearchInput(container.querySelector("#agent-search"), (value) => {
    state.agentSearch = value;
  });
}

function renderAgentRow(agent) {
  const isOn = state.agentSwitches.has(agent.name);
  return `
    <div class="agent-row">
      <div>
        <h4>${agent.name}</h4>
        <span class="tag ${isOn ? "accent" : "amber"}">${isOn ? "原型标记开启" : agent.status}</span>
      </div>
      <p>${agent.role}<br /><strong>输入：</strong>${agent.input}<br /><strong>输出：</strong>${agent.output}</p>
      <label class="switch">
        <button class="switch-button ${isOn ? "is-on" : ""}" type="button" data-agent="${agent.name}" aria-label="切换 ${agent.name}"></button>
        <span>${isOn ? "已标记" : "未标记"}</span>
      </label>
    </div>
  `;
}

function renderSourcePage(container) {
  const table =
    state.sourceEntity === "definition"
      ? {
          title: "data_source_definition 源头定义表",
          desc: "定义当前需要接入的运行数据源；数据域和标准化目标放在字段详情里，不挤在列表主视图。",
          schema: dataSourceDefinitionSchema,
          rows: dataSourceDefinitionRows,
          visibleColumns: [
            "id",
            "name",
            "source_type",
            "provider",
            "access_protocol",
            "endpoint_ref",
            "auth_ref",
            "update_mode",
            "status",
          ],
        }
      : {
          title: "symbol_data_map 本地数据地图",
          desc: "按标的记录本地目前有哪些数据。点击一行查看该标的的价格、trade、NBBO、期权链等细分覆盖。",
          schema: symbolDataMapSchema,
          rows: symbolDataMapRows,
          visibleColumns: [
            "symbol",
            "asset_type",
            "market",
            "primary_sources",
            "quality_status",
            "last_updated",
            "notes",
          ],
        };

  const query = state.sourceSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row)
      .filter((value) => !Array.isArray(value))
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  const selectedSymbol = symbolDataMapRows.find((row) => row.symbol === state.selectedDataSymbol);
  table.context = { page: "sources", entity: state.sourceEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "数据源实体切换",
        dataName: "source-entity",
        current: state.sourceEntity,
        options: [
          { key: "definition", label: "源头定义", code: "data_source_definition", desc: "数据从哪里来，如何接入", count: dataSourceDefinitionRows.length },
          { key: "map", label: "数据Map", code: "symbol_data_map", desc: "按标的索引本地数据覆盖", count: symbolDataMapRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="source-search" type="search" value="${escapeAttr(state.sourceSearch)}" placeholder="搜索数据源、标的、来源、状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录${state.sourceEntity === "map" ? "；点击标的查看数据详情" : ""}</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table source-entity-table">
          <thead>
            <tr>${table.visibleColumns.map((col) => renderColumnHeader(col, table.schema)).join("")}${renderRelationHeader()}</tr>
          </thead>
          <tbody>
            ${
              rows.length
                ? rows
                    .map((row) =>
                      state.sourceEntity === "map"
                        ? `
                          <tr class="clickable-row ${row.symbol === state.selectedDataSymbol ? "is-selected" : ""}" data-symbol-record="${escapeAttr(row.symbol)}" tabindex="0">
                            ${renderTableCells(row, table.visibleColumns)}${renderRelationCell(row, table.context)}
                          </tr>
                        `
                        : `
                          <tr>${renderTableCells(row, table.visibleColumns)}${renderRelationCell(row, table.context)}</tr>
                        `,
                    )
                    .join("")
                : `<tr><td colspan="${table.visibleColumns.length + 1}">没有匹配记录。</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.sourceEntity === "definition" ? "源头定义字段字典" : "数据 Map 字段字典",
      state.sourceEntity === "definition" ? "源头定义只描述接入方式；不展示明文 token。" : "数据 Map 只做标的级索引，细分覆盖在标的详情里。",
    )}
    ${selectedSymbol ? renderSymbolDataDrawer(selectedSymbol) : ""}
  `;

  container.querySelectorAll("[data-source-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sourceEntity = button.dataset.sourceEntity;
      state.sourceSearch = "";
      state.selectedDataSymbol = null;
      render();
      syncRoute();
    });
  });
  bindSearchInput(container.querySelector("#source-search"), (value) => {
    state.sourceSearch = value;
  });
  container.querySelectorAll("[data-symbol-record]").forEach((row) => {
    const openSymbol = () => {
      state.selectedDataSymbol = row.dataset.symbolRecord;
      render();
      syncRoute();
    };
    row.addEventListener("click", openSymbol);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSymbol();
      }
    });
  });
  container.querySelectorAll("[data-close-source-drawer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDataSymbol = null;
      render();
      syncRoute();
    });
  });
}

function renderSymbolDataDrawer(symbolRow) {
  return `
    <div class="drawer-backdrop" data-close-source-drawer></div>
    <aside class="path-drawer source-drawer" aria-label="标的数据详情抽屉">
      <div class="path-drawer-header">
        <div>
          <p class="eyebrow">symbol_data_map</p>
          <h3>${symbolRow.symbol}</h3>
          <p>${symbolRow.asset_type} · ${symbolRow.market} · ${symbolRow.notes}</p>
        </div>
        <button class="icon-button" type="button" data-close-source-drawer aria-label="关闭抽屉">×</button>
      </div>
      <div class="path-drawer-body">
        <div class="path-record-summary">
          ${[
            ["质量状态", symbolRow.quality_status],
            ["主要来源", symbolRow.primary_sources],
            ["覆盖开始", symbolRow.coverage_start],
            ["最近更新", symbolRow.last_updated],
          ]
            .map(
              ([label, value]) => `
                <div>
                  <strong>${label}</strong>
                  <span>${formatCell(value)}</span>
                </div>
              `,
            )
            .join("")}
        </div>
        <section class="entity-panel drawer-section">
          <div class="entity-header">
            <div>
              <h3>数据域覆盖</h3>
              <p>这里展示这个标的当前已经有、计划接入或暂缺的数据细分。</p>
            </div>
          </div>
          <div class="data-domain-grid">
            ${symbolRow.datasets.map(renderSymbolDatasetCard).join("")}
          </div>
        </section>
      </div>
    </aside>
  `;
}

function renderSymbolDatasetCard(dataset) {
  return `
    <div class="data-domain-card">
      <div class="domain-card-head">
        <strong>${dataset.domain}</strong>
        <span class="tag ${dataset.status === "partial" || dataset.status === "ready" ? "accent" : "amber"}">${dataset.status}</span>
      </div>
      <dl>
        <div>
          <dt>粒度</dt>
          <dd>${dataset.granularity}</dd>
        </div>
        <div>
          <dt>来源</dt>
          <dd>${dataset.source}</dd>
        </div>
        <div>
          <dt>范围</dt>
          <dd>${dataset.range}</dd>
        </div>
        <div>
          <dt>更新</dt>
          <dd>${dataset.last_updated}</dd>
        </div>
      </dl>
      <p>${dataset.detail}</p>
    </div>
  `;
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function initFromHash() {
  applyRouteFromHash();
}

mountNav();
attachReferenceJumpHandler();
initFromHash();
updateRuntimeChrome();
render();
loadBackendData();

window.pathHarnessSpec = {
  collectReferenceIssues,
  referenceFieldRules,
  entityRegistry,
};

window.addEventListener("hashchange", () => {
  initFromHash();
  render();
});

window.addEventListener("popstate", () => {
  initFromHash();
  render();
});
