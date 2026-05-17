const icons = {
  horizontal:
    '<svg viewBox="0 0 24 24"><path d="M4 12h16"/><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/></svg>',
  vertical:
    '<svg viewBox="0 0 24 24"><path d="M12 4v16"/><path d="m8 8 4-4 4 4"/><path d="m8 16 4 4 4-4"/></svg>',
  path:
    '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h3a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4"/></svg>',
  consumer:
    '<svg viewBox="0 0 24 24"><path d="M4 5h9"/><path d="M4 12h7"/><path d="M4 19h9"/><path d="M15 8l4 4-4 4"/><path d="M11 12h8"/></svg>',
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
  { key: "consumers", label: "消费渠道管理", icon: icons.consumer },
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
    id: "hc_power_hour_1435_1500_observation",
    name: "14:35-15:00数据观察窗口",
    category: "日内",
    coordinate_type: "时间窗口",
    definition: "美股常规交易日 14:35-15:00 ET 的数据观察窗口：14:35-14:50 ET 用来生成参考高点；14:50-15:00 ET 用 1分钟K线寻找固定窗口末分钟信号和 VWAP 深度偏离上拐信号；信号分钟收完后，下一分钟第一笔逐笔成交才可入场。",
    original_time_text: "14:35-15:00 ET",
    time_basis: "ET",
    timezone: "America/New_York",
    dst_policy: "跟随美股夏令时/冬令时",
    anchor: "regular_session_close - power_hour",
    start_rule: "regular_session 14:35 ET",
    end_rule: "regular_session 14:59 ET signal bar, followed by next-minute first tick execution",
    known_at_rule: "14:35-14:50 参考高点在 14:50 ET 已知；每个候选信号只在对应 1分钟K线收完后才可确认；固定窗口末分钟信号在 14:59 bar 收完后确认，VWAP 上拐信号在触发分钟收完后确认。",
    recurrence: "每个美股常规交易日",
    market_scope: "US equities",
    flow_tags: "power_hour, 小V反弹, fixed_end, vwap_turn",
    linked_vertical_types: "vc_vwap_deep_deviation, vc_pre_entry_2m_range_filter, vc_entry_pullback_within_1pct",
    data_requirements: "1m OHLCV bars from 09:30 ET for VWAP and 14:35-14:50 reference high; tick trades for next-minute first-tick entry",
    check_frequency: "1m during 14:35-15:00 ET; tick only at execution",
    evidence_count: "power_hour_lab baseline candidate",
    confidence: "已回测候选",
    status: "review",
    notes: "这是该短策略唯一横坐标；14:35-14:50 是参考高点窗口，14:50-15:00 是信号窗口；入场执行、TP/SL 和同日去重属于 Path 内部规则，不拆成横坐标。",
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
    id: "vc_vwap_deep_deviation",
    name: "VWAP深度偏离",
    category: "动态基准偏离",
    coordinate_type: "比例价",
    price_domain: "percent",
    definition: "当前分钟收盘价相对当日分钟级 VWAP 的偏离度达到参数阈值：close_t / VWAP_t - 1 <= -0.006，即 close_t <= VWAP_t * 0.994。",
    computation_method: "typical_price_t = (high_t + low_t + close_t) / 3; VWAP_t = sum(typical_price_i * volume_i) / sum(volume_i) from 09:30 ET through minute t; vwap_deviation_t = close_t / VWAP_t - 1",
    source_window_rule: "hc_power_hour_1435_1500_observation",
    required_horizontal_ids: "hc_power_hour_1435_1500_observation",
    market_scope: "US equities",
    input_data: "1m OHLCV bars from regular session open",
    value_unit: "percent",
    valid_from_rule: "after each 14:50-14:59 ET minute bar closes",
    valid_until_rule: "candidate signal minute execution check",
    invalidated_by: "VWAP unavailable, zero cumulative volume, missing minute bar, halt/abnormal bar",
    flow_tags: "vwap_turn, 深度偏离, 小V反弹",
    evidence_count: "prepare_data.py vwap_turn threshold from tested parameter set",
    confidence: "已回测候选",
    status: "review",
    notes: "上拐条件 close_t > close_{t-1} 是 Path 信号公式里的动作条件，不单独拆成纵坐标。",
  },
  {
    id: "vc_pre_entry_2m_range_filter",
    name: "入场前两分钟振幅",
    category: "短线波动过滤",
    coordinate_type: "区间振幅",
    price_domain: "percent",
    definition: "候选信号入场前最后两根已完成 1分钟K线的高低点振幅必须 >= 0.30%，用于确认入场前确实有足够短线波动。",
    computation_method: "m2_range = max(current_high, prev_high) / min(current_low, prev_low) - 1; require m2_range >= 0.0030",
    source_window_rule: "hc_power_hour_1435_1500_observation",
    required_horizontal_ids: "hc_power_hour_1435_1500_observation",
    market_scope: "US equities",
    input_data: "1m OHLCV bars",
    value_unit: "percent",
    valid_from_rule: "after candidate signal minute closes and before next-minute first-tick entry",
    valid_until_rule: "entry decision only",
    invalidated_by: "m2_range < 0.30%, missing previous minute bar, missing current minute bar",
    flow_tags: "volatility_filter, 弹性过滤, no_trade_flat_day",
    evidence_count: "prepare_data.py m2_range_min threshold from tested parameter set",
    confidence: "已回测候选",
    status: "review",
    notes: "这是入场过滤纵坐标；固定 TP/SL 是 Path 内部交易管理参数，不拆成纵坐标。",
  },
  {
    id: "vc_entry_pullback_within_1pct",
    name: "高点回落不超过1%",
    category: "追价风险过滤",
    coordinate_type: "回撤比例",
    price_domain: "percent",
    definition: "候选入场价相对 14:35-14:50 ET 参考高点的回落幅度不能超过 1.00%，即 reference_high_1435_1450 / entry_price - 1 <= 0.0100；用于避免价格已经从短线高点回落太深时入场。",
    computation_method: "reference_high_1435_1450 = max(1m high) over 14:35-14:49 ET completed bars; entry_price = next-minute first tick trade price; pullback_from_high = reference_high_1435_1450 / entry_price - 1; require pullback_from_high <= 0.0100",
    source_window_rule: "hc_power_hour_1435_1500_observation",
    required_horizontal_ids: "hc_power_hour_1435_1500_observation",
    market_scope: "US equities",
    input_data: "1m OHLCV bars and next-minute first tick trade",
    value_unit: "percent",
    valid_from_rule: "when next-minute first tick appears after candidate signal minute",
    valid_until_rule: "entry decision only",
    invalidated_by: "pullback_from_high > 1.00%, missing 14:35-14:49 reference high, missing next-minute first tick",
    flow_tags: "chase_risk_control, pullback_filter, entry_quality",
    evidence_count: "user-specified baseline filter",
    confidence: "待验证",
    status: "review",
    notes: "这是粗颗粒度价格位置过滤，不拆 A/B/C；参考高点只取 14:35-14:50 前置窗口，不使用 14:50 后信号窗口高点。",
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
  ["time_scope", "适用时间范围。"],
  ["required_data", "需要的数据源。"],
  ["discovered_by", "发现/提出/入库来源：AI Agent、用户、Codex、外部交易员或人工整理。"],
  ["owner_agent", "主要维护或生成它的 Agent。"],
  ["evidence_count", "证据数量。"],
  ["confidence", "候选、待验证、已验证。"],
  ["notes", "补充说明。"],
];

const pathApplicationSchema = [
  ["application_id", "Path 应用唯一 ID。"],
  ["path_definition_id", "对应 path_definition.id。"],
  ["name", "应用名称，表达定义和交易目标标的的组合。"],
  ["target_symbol", "本次应用的交易目标标的。"],
  ["target_market", "交易市场或交易所框架。"],
  ["target_asset_type", "目标标的类型。"],
  ["parameter_profile", "该应用锁定的参数版本和关键阈值。"],
  ["monitor_id", "24h 监听任务 ID。"],
  ["monitor_script", "单独监听代码路径。"],
  ["monitor_runtime", "运行方式、进程和工作目录。"],
  ["run_mode", "常驻、定时或手动等运行模式。"],
  ["runtime_state", "running、ready、paused、failed。"],
  ["heartbeat_ref", "心跳文件或运行状态引用。"],
  ["pid_ref", "PID 文件或进程引用。"],
  ["last_heartbeat_at", "最近一次心跳来源或时间。"],
  ["data_sources", "监听需要的数据源。"],
  ["output_targets", "监听输出写入位置。"],
  ["application_result_summary", "此定义在该标的上的应用或验证结论。"],
  ["status", "active、review、paused、deprecated。"],
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
    id: "path_power_hour_v_rebound_fixed_tp_sl",
    name: "尾盘小V固定TP/SL基准策略",
    path_family: "日内 / power_hour / 短线反弹",
    version: "0.2",
    status: "review",
    description: "14:35-14:50 ET 记录参考高点，14:50-15:00 ET 用 1分钟K线寻找固定窗口末分钟信号和 VWAP 深度偏离上拐信号的并集；同一天只取最早可执行的一笔，入场前要求前两分钟振幅 >= 0.30%，且候选入场价从 14:35-14:50 参考高点回落不超过 1.00%，下一分钟第一笔逐笔成交做多，固定 TP +1.00% / SL -1.00%，未触发则 15:59:30 ET 退出。",
    node_sequence: "power_hour_observation_window -> signal_union_fixed_or_vwap_turn -> entry_filters_range_and_pullback -> next_minute_first_tick_long -> fixed_tp_sl_or_tail_exit",
    edge_rules: "固定窗口末分钟信号：14:59 这根 1m K 收完后准备下一分钟执行；VWAP 深度偏离上拐信号：14:50-14:59 中第一个满足 close/VWAP-1 <= -0.006 且 close_t > close_{t-1} 的分钟。两个信号同日都触发时，只保留最早能执行的一笔；入场前 m2_range >= 0.0030，且 reference_high_1435_1450 / entry_price - 1 <= 0.0100；入场后 TP +1.00%、SL -1.00%，若均未触发则在 15:59:30 ET 退出，不等到最后时刻。",
    horizontal_definition_ids: "hc_power_hour_1435_1500_observation",
    vertical_definition_ids: "vc_vwap_deep_deviation, vc_pre_entry_2m_range_filter, vc_entry_pullback_within_1pct",
    flow_hypothesis: "尾盘若出现低位小V反弹或固定尾段入场信号，并且入场前两分钟有足够短线波动、入场价没有从 14:35-14:50 参考高点回落过深，可能提供可量化的短线反弹交易；过滤低振幅日和过深回落以提高入场质量。",
    entry_observation_rule: "每个美股常规交易日 14:35 ET 开始记录参考高点，14:50 ET 开始观察 1m 信号；候选信号分钟收完后检查两分钟振幅过滤；下一分钟第一笔成交出现时再检查高点回落过滤，通过后做多。",
    invalidation_rule: "当日无 1m/VWAP 数据、14:35-14:49 参考高点缺失、信号分钟或前一分钟缺失、m2_range < 0.30%、reference_high_1435_1450 / entry_price - 1 > 1.00%、下一分钟无可用逐笔成交、停牌/异常跳价、同日已有更早入场信号被执行。",
    evaluation_plan: "继续做 no-lookahead 回测：固定训练/测试分割，分别报告固定窗口末分钟、VWAP 深度偏离上拐、两者并集、m2_range >= 0.30%、高点回落 <= 1.00% 逐层过滤后的样本数、胜率、平均收益、MFE/MAE、尾部退出占比。",
    time_scope: "美股常规交易日 14:35-16:00 ET，跟随纽约夏令时/冬令时；VWAP 累计从 09:30 ET 开始；尾部退出固定为 15:59:30 ET。",
    required_data: "1m OHLCV bars, tick trades for next-minute first-tick entry",
    discovered_by: "手动：用户在 power_hour 项目发现，Codex 根据本地回测整理入库",
    owner_agent: "agent_path_validator",
    evidence_count: "power_hour_lab baseline: fixed_end + vwap_turn + m2_range_min + pullback filter candidate",
    confidence: "已回测候选",
    notes: "当前只入定义，不入具体日期实例。TP/SL 和 15:59:30 尾部退出是 Path 内部交易管理参数，不作为纵坐标；下一分钟第一笔成交是执行规则，不作为单独横坐标。",
  },
];

const pathApplicationRows = [
  {
    application_id: "app_path_power_hour_v_rebound_tsll",
    path_definition_id: "path_power_hour_v_rebound_fixed_tp_sl",
    name: "尾盘小V固定TP/SL基准策略 / TSLL",
    target_symbol: "TSLL",
    target_market: "US equities",
    target_asset_type: "leveraged ETF",
    parameter_profile: "v0.2：14:35-14:50 参考高点；14:50-15:00 信号窗口；m2_range >= 0.30%；高点回落 <= 1.00%；TP/SL = +/-1.00%；15:59:30 ET 尾部退出。",
    monitor_id: "monitor_tsll_power_hour_v_rebound",
    monitor_script: "monitors/tsll_power_hour_v_rebound_monitor.py",
    monitor_runtime: "launchd user agent com.zhaoge.path-application.tsll; installed runtime under /Users/hong/Library/Application Support/ZhaogePathHarness",
    run_mode: "24h local listener",
    runtime_state: "running",
    heartbeat_ref: "/Users/hong/Library/Application Support/ZhaogePathHarness/runtime/path_applications/app_path_power_hour_v_rebound_tsll/heartbeat.json",
    pid_ref: "/Users/hong/Library/Application Support/ZhaogePathHarness/runtime/path_applications/app_path_power_hour_v_rebound_tsll/monitor.pid",
    last_heartbeat_at: "读取 heartbeat.json",
    data_sources: "1m OHLCV bars, tick trades, local runtime heartbeat",
    output_targets: "heartbeat.json, monitor.log, future path_instance candidates",
    application_result_summary: "该参数版本已在 TSLL 上应用并得到不错结果；应用层记录标的，不污染 Path 定义、横坐标或纵坐标。",
    status: "active",
    notes: "该应用把抽象 Path 定义绑定到 TSLL，并由独立 24h 监听代码维护运行状态；行情判断和交易执行仍按后续接入数据源/风控模块扩展。",
  },
];

const pathInstanceRows = [];

const consumerChannelDefinitionSchema = [
  ["id", "消费渠道定义唯一 ID。"],
  ["name", "渠道名称。"],
  ["channel_type", "消费类型：audit_log、notification、paper_trade、live_trade、webhook、review_queue。"],
  ["consumer_stage", "消费发生在信号生命周期的哪个阶段：记录、通知、模拟成交、实盘下单、人工复核。"],
  ["signal_contract", "该渠道接受的信号契约和最小字段。"],
  ["input_sources", "允许消费哪些上游输出，例如 path_application、path_instance、Agent 输出。"],
  ["output_sink_ref", "输出落点引用；只写 env/config/local 引用或内部表名，不写明文密钥。"],
  ["delivery_mode", "同步、异步、批量、人工确认后执行。"],
  ["idempotency_rule", "幂等规则，避免同一信号被重复通知或重复下单。"],
  ["risk_gate", "风险闸门：record_only、notify_only、paper_only、manual_approval_required、live_disabled 等。"],
  ["allowed_actions", "该渠道允许执行的动作集合。"],
  ["audit_policy", "审计保存策略和复盘要求。"],
  ["latency_slo", "延迟目标或容忍度。"],
  ["failure_policy", "失败重试、降级、静默或人工接管策略。"],
  ["owner_agent", "负责写入或维护该渠道的 Agent。"],
  ["status", "active、planned、disabled、review。"],
  ["notes", "补充说明。"],
];

const signalConsumptionRecordSchema = [
  ["record_id", "信号消费记录唯一 ID。"],
  ["channel_id", "对应 consumer_channel_definition.id。"],
  ["path_application_id", "产生信号的 Path 应用 ID；如果不是 Path 应用输出，可以为空。"],
  ["path_instance_id", "信号关联的 Path 实例 ID；未生成实例前可以为空。"],
  ["signal_id", "上游信号 ID。"],
  ["signal_type", "信号类型：watchlist_alert、entry_candidate、exit_candidate、risk_alert、daily_digest。"],
  ["symbol", "该信号作用的标的。"],
  ["emitted_at_rule", "信号产生时间框架；定义库原型不写具体日期。"],
  ["consumed_at_rule", "渠道消费时间框架；真实时间戳进入运行日志。"],
  ["decision_payload_ref", "消费时使用的结构化信号载荷引用。"],
  ["delivery_status", "pending、sent、recorded、paper_filled、live_submitted、failed、skipped。"],
  ["consumer_result", "渠道返回结果、模拟成交结果或通知摘要。"],
  ["latency_ms", "从信号产生到消费完成的耗时。"],
  ["error_message", "失败原因或降级说明。"],
  ["audit_state", "待审、已审、忽略、需要人工复核。"],
  ["notes", "复盘备注。"],
];

const consumerChannelDefinitionRows = [
  {
    id: "consumer_signal_audit_log",
    name: "信号审计日志",
    channel_type: "audit_log",
    consumer_stage: "record",
    signal_contract: "path_signal_v1: signal_id, path_application_id, symbol, side, confidence, trigger_snapshot, risk_state",
    input_sources: "path_application, path_instance, ai_agent_instance",
    output_sink_ref: "local:signal_consumption_records",
    delivery_mode: "sync_append",
    idempotency_rule: "signal_id + channel_id 唯一；重复写入只更新状态和最近结果。",
    risk_gate: "record_only",
    allowed_actions: "record_signal, attach_payload_ref, update_delivery_status",
    audit_policy: "所有信号先落审计；任何通知、模拟仓或 live 交易都必须能回链到审计记录。",
    latency_slo: "< 1s local append",
    failure_policy: "本地写入失败则阻断下游消费，并把错误暴露给 runtime 指标。",
    owner_agent: "agent_path_validator",
    status: "active",
    notes: "这是所有消费渠道的根记录层；它不通知、不下单，只保证信号有证据链。",
  },
  {
    id: "consumer_discord_alert",
    name: "Discord 信号通知",
    channel_type: "notification",
    consumer_stage: "notify",
    signal_contract: "path_signal_v1 with compact human summary and runtime metrics",
    input_sources: "consumer_signal_audit_log",
    output_sink_ref: "env:DISCORD_WEBHOOK_URL",
    delivery_mode: "async_http_post",
    idempotency_rule: "同一 signal_id 在同一 channel_id 只发一次；状态更新走 thread/update 规则后续再加。",
    risk_gate: "notify_only",
    allowed_actions: "send_alert, send_digest, send_failure_notice",
    audit_policy: "发送前后都写 signal_consumption_record；保存 payload_ref、耗时和 HTTP 状态。",
    latency_slo: "< 5s after signal audit",
    failure_policy: "失败重试 2 次；仍失败则只保留审计记录并标记 failed。",
    owner_agent: "agent_market_state_monitor",
    status: "planned",
    notes: "只消费信号，不产生交易动作；webhook 明文必须留在环境变量或密钥库。",
  },
  {
    id: "consumer_paper_portfolio",
    name: "模拟仓执行",
    channel_type: "paper_trade",
    consumer_stage: "paper_execution",
    signal_contract: "trade_intent_v1: symbol, side, entry_rule, exit_rule, size_model, risk_state",
    input_sources: "consumer_signal_audit_log, path_instance",
    output_sink_ref: "local:paper_portfolio_ledger",
    delivery_mode: "async_local_ledger",
    idempotency_rule: "signal_id + symbol + side + strategy_version 唯一；重复信号只更新意图，不重复开仓。",
    risk_gate: "paper_only",
    allowed_actions: "paper_open, paper_close, paper_skip, mark_to_market",
    audit_policy: "保存触发价、假成交价、滑点模型、退出原因和后续 MFE/MAE。",
    latency_slo: "< 2s local simulation",
    failure_policy: "模拟仓失败不影响日志和通知；记录 failed 并等待人工检查。",
    owner_agent: "agent_path_validator",
    status: "planned",
    notes: "用于让 Path 先在模拟仓里长期跑，人工验证后再考虑 live 渠道。",
  },
  {
    id: "consumer_live_broker_order",
    name: "Live Broker 实盘交易",
    channel_type: "live_trade",
    consumer_stage: "live_execution",
    signal_contract: "approved_trade_intent_v1 after human approval and risk checks",
    input_sources: "consumer_signal_audit_log, consumer_paper_portfolio",
    output_sink_ref: "config:BROKER_ORDER_API",
    delivery_mode: "manual_approval_then_api",
    idempotency_rule: "broker_client_order_id = signal_id + approved_revision；任何重试必须复用同一个 client_order_id。",
    risk_gate: "manual_approval_required, live_disabled_by_default",
    allowed_actions: "submit_order_after_approval, cancel_order_after_approval",
    audit_policy: "必须保存审批人、审批时刻、订单请求、券商回执、成交回报和撤单记录。",
    latency_slo: "human gated",
    failure_policy: "默认禁用；任何接口失败都不得自动放大或重复下单。",
    owner_agent: "manual_trader",
    status: "disabled",
    notes: "实盘渠道只是数据模型占位；没有人工审批、风控和券商接入前绝不启用。",
  },
];

const signalConsumptionRecordRows = [];

const pathCanvasDefinitions = [
  {
    id: "node_observation_window",
    seq: "01",
    title: "观察窗口",
    meta: "14:35-15:00 ET",
    detail: "唯一横坐标：14:35-14:50 记录参考高点，14:50-15:00 观察 1分钟K线信号。",
    kind: "event",
    x: 36,
    y: 96,
    horizontalIds: "hc_power_hour_1435_1500_observation",
  },
  {
    id: "node_signal_union",
    seq: "02",
    title: "信号并集",
    meta: "fixed_end or vwap_turn",
    detail: "固定窗口末分钟信号，或 VWAP 深度偏离后当前分钟收盘高于上一分钟收盘；同日只保留最早可执行的一笔。",
    kind: "flow",
    x: 274,
    y: 96,
    verticalIds: "vc_vwap_deep_deviation",
  },
  {
    id: "node_entry_filters",
    seq: "03",
    title: "入场过滤",
    meta: "range + pullback",
    detail: "信号分钟收完后检查前两分钟振幅；下一分钟第一笔成交出现时，再检查相对 14:35-14:50 参考高点回落是否不超过 1%。",
    kind: "watching",
    x: 512,
    y: 96,
    verticalIds: "vc_pre_entry_2m_range_filter, vc_entry_pullback_within_1pct",
  },
  {
    id: "node_execution",
    seq: "04",
    title: "执行与风控",
    meta: "next tick, TP/SL 1%, 15:59:30",
    detail: "通过过滤后，在下一分钟第一笔逐笔成交做多；固定 TP +1.00%、SL -1.00%，未触发则 15:59:30 ET 退出。",
    kind: "terminal",
    x: 750,
    y: 248,
  },
];

const pathCanvasDefinitionEdges = [
  { from: "node_observation_window", to: "node_signal_union", label: "观察1m信号" },
  { from: "node_signal_union", to: "node_entry_filters", label: "候选触发" },
  { from: "node_entry_filters", to: "node_execution", label: "过滤通过" },
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
    name: "Binance/BTC USD-M Futures 实时流",
    type: "跨市场预警",
    coverage: "BTCUSDT/ETHUSDT 永续合约 aggTrade、1m Kline、REST 回填和分钟聚合。",
    status: "已接入",
  },
  {
    name: "美国假期日历",
    type: "交易日历",
    coverage: "美股休市、半日市和节假日前后窗口。",
    status: "已接入",
  },
  {
    name: "美联储 FOMC 日历",
    type: "宏观事件",
    coverage: "议息、纪要、点阵图、主席讲话等可预知事件窗口。",
    status: "已接入",
  },
  {
    name: "中国假期日历",
    type: "交易日历",
    coverage: "国务院公众假期与调休；A股/HK Connect 休市待交易所日历叠加。",
    status: "已接入公众假期",
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
  ["primary_sources", "主要行情/标的级数据来源；全局日历源不挂到个股这里，避免误判成能供应个股行情。"],
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
    name: "Binance BTC/ETH USD-M Futures 实时流",
    source_type: "crypto_stream",
    provider: "Binance USD-M Futures public market data",
    access_protocol: "WebSocket / REST backfill / REST fallback",
    endpoint_ref: "config:BINANCE_FUTURES_WS_BASE, config:BINANCE_FUTURES_REST_BASE",
    auth_ref: "none_for_public_market_data",
    data_domains: "crypto_price,aggTrade,kline_1m,kline_5m,volume,alerts",
    update_mode: "stream / scheduled_backfill",
    expected_latency: "sub-second to seconds",
    historical_coverage: "2022-01-01 forward via /fapi/v1/klines; stream forward",
    retention_policy: "raw JSONL + normalized 1m/5m bars under ZHAOGE_DATA_ROOT",
    normalization_target: "crypto_ticks,crypto_bars,symbol_data_map",
    status: "active",
    notes: "BTCUSD 用户口径映射为 BTCUSDT USD-M 永续合约；用于 BTC/ETH 先行和币股预警。",
  },
  {
    id: "src_us_holiday_calendar",
    name: "美国假期日历",
    source_type: "holiday_calendar",
    provider: "NYSE official calendar",
    access_protocol: "official web source + local normalized JSONL",
    endpoint_ref: "config:US_HOLIDAY_CALENDAR_SOURCE",
    auth_ref: "none_for_public_calendar",
    data_domains: "us_holidays,market_closures,half_days",
    update_mode: "scheduled_pull",
    expected_latency: "daily",
    historical_coverage: "2026-2028 normalized in local calendar source",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,market_sessions,horizontal_coordinate_occurrence",
    status: "active",
    notes: "全局市场日历源，不供应 TSLA/AAPL 等个股行情；用于节假日前后、半日市和交易日判定，输出 full close / early close / equity close / options close。",
  },
  {
    id: "src_fomc_calendar",
    name: "美联储 FOMC 日历",
    source_type: "macro_calendar",
    provider: "Federal Reserve official calendar",
    access_protocol: "official web source + local normalized JSONL",
    endpoint_ref: "config:FOMC_CALENDAR_SOURCE",
    auth_ref: "none_for_public_calendar",
    data_domains: "fomc_meeting,minutes,dot_plot,powell_speech",
    update_mode: "scheduled_pull",
    expected_latency: "daily / event dependent",
    historical_coverage: "2026 forward from Federal Reserve calendar, with local fallback",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,horizontal_coordinate_occurrence",
    status: "active",
    notes: "全局宏观日历源，不供应个股行情；用于 FOMC 前后横坐标和事件节点，known_at 使用官方日历拉取时点，不用事后新闻重写过去。",
  },
  {
    id: "src_cn_holiday_calendar",
    name: "中国假期日历",
    source_type: "holiday_calendar",
    provider: "中国政府网 / 国务院办公厅",
    access_protocol: "official notice + local normalized JSONL",
    endpoint_ref: "config:CN_HOLIDAY_CALENDAR_SOURCE",
    auth_ref: "none_for_public_calendar",
    data_domains: "cn_holidays,cn_market_closures,hk_connect_closures",
    update_mode: "scheduled_pull",
    expected_latency: "daily",
    historical_coverage: "2026 public holidays and make-up workdays",
    retention_policy: "normalized event table",
    normalization_target: "event_calendar,market_sessions,horizontal_coordinate_occurrence",
    status: "active_partial",
    notes: "用于中国节假日、港股通/跨市场风险窗口；当前只登记公众假期和调休，A股/HK Connect 休市待交易所日历叠加。",
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
    primary_sources: "src_bc_market_data",
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
    primary_sources: "src_bc_market_data",
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
      { domain: "crypto_lead", status: "ready", granularity: "BTC/ETH USD-M Futures stream", source: "Binance", range: "forward + REST backfill", last_updated: "runtime manifest", detail: "用于 1-5 分钟 lead-lag。" },
      { domain: "options", status: "planned", granularity: "chain/trades/IV", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于 CONL/COIN 高波动期权。" },
    ],
  },
  {
    symbol: "BTCUSDT",
    asset_type: "crypto",
    market: "crypto",
    primary_sources: "src_binance_crypto_stream",
    price_data: "yes",
    trade_data: "aggTrade",
    nbbo_data: "n/a",
    bar_data: "1m/5m ready via REST backfill; 1m stream forward",
    snapshot_data: "24h ticker fallback",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "macro/crypto events planned",
    coverage_start: "2022-01-01 backfill capable",
    coverage_end: "streaming / latest manifest",
    last_updated: "runtime manifest",
    quality_status: "ready",
    notes: "跨市场预警源，不是美股标的；用户口径 BTCUSD 映射为 Binance BTCUSDT USD-M 永续。",
    datasets: [
      { domain: "price_stream", status: "ready", granularity: "aggTrade + kline_1m", source: "Binance USD-M Futures WebSocket", range: "forward", last_updated: "runtime manifest", detail: "用于 BTC 分钟预警价。" },
      { domain: "bars", status: "ready", granularity: "1m/5m aggregates", source: "Binance /fapi/v1/klines + WebSocket", range: "2022-01-01 forward capable", last_updated: "runtime manifest", detail: "用于 lead-lag 特征。" },
      { domain: "alerts", status: "active", granularity: "delta pct / round levels", source: "local harness", range: "runtime", last_updated: "runtime", detail: "用于生成横纵坐标实例。" },
    ],
  },
  {
    symbol: "ETHUSDT",
    asset_type: "crypto",
    market: "crypto",
    primary_sources: "src_binance_crypto_stream",
    price_data: "yes",
    trade_data: "aggTrade",
    nbbo_data: "n/a",
    bar_data: "1m/5m ready via REST backfill; 1m stream forward",
    snapshot_data: "24h ticker fallback",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "macro/crypto events planned",
    coverage_start: "2022-01-01 backfill capable",
    coverage_end: "streaming / latest manifest",
    last_updated: "runtime manifest",
    quality_status: "ready",
    notes: "BTC 辅助确认和币股风险偏好对照源，使用 Binance ETHUSDT USD-M 永续。",
    datasets: [
      { domain: "price_stream", status: "ready", granularity: "aggTrade + kline_1m", source: "Binance USD-M Futures WebSocket", range: "forward", last_updated: "runtime manifest", detail: "用于 ETH/BTC 风险偏好确认。" },
      { domain: "bars", status: "ready", granularity: "1m/5m aggregates", source: "Binance /fapi/v1/klines + WebSocket", range: "2022-01-01 forward capable", last_updated: "runtime manifest", detail: "用于 lead-lag 特征。" },
      { domain: "alerts", status: "active", granularity: "delta pct / round levels", source: "local harness", range: "runtime", last_updated: "runtime", detail: "用于生成横纵坐标实例。" },
    ],
  },
  {
    symbol: "MSTR",
    asset_type: "stock",
    market: "US",
    primary_sources: "src_bc_market_data, src_binance_crypto_stream",
    price_data: "partial",
    trade_data: "planned",
    nbbo_data: "planned",
    bar_data: "1m/daily planned",
    snapshot_data: "planned",
    option_chain_data: "planned",
    option_trade_quote_data: "planned",
    news_event_data: "crypto/news planned; BTC lead active",
    coverage_start: "pending scan",
    coverage_end: "pending scan",
    last_updated: "pending",
    quality_status: "partial",
    notes: "BTC 高 beta 代理。",
    datasets: [
      { domain: "price", status: "planned", granularity: "bars", source: "BC API", range: "pending scan", last_updated: "n/a", detail: "用于 BTC 到币股 path。" },
      { domain: "options", status: "planned", granularity: "chain/trades/IV", source: "BC API", range: "not loaded", last_updated: "n/a", detail: "用于高波动期权。" },
    ],
  },
  {
    symbol: "US_HOLIDAY_CALENDAR",
    asset_type: "calendar",
    market: "US",
    primary_sources: "src_us_holiday_calendar",
    price_data: "n/a",
    trade_data: "n/a",
    nbbo_data: "n/a",
    bar_data: "n/a",
    snapshot_data: "n/a",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "full close / early close ready",
    coverage_start: "2026 normalized",
    coverage_end: "2028 normalized capable",
    last_updated: "runtime manifest",
    quality_status: "ready",
    notes: "全局美国市场日历数据集；只供应节假日、半日市和交易时段事件，不供应任何个股行情。",
    datasets: [
      { domain: "market_sessions", status: "ready", granularity: "full close / early close / regular close / options close", source: "NYSE official calendar", range: "2026 forward normalized", last_updated: "runtime manifest", detail: "用于交易日判定、假日前后窗口和半日市横坐标。" },
      { domain: "events", status: "ready", granularity: "event_calendar JSONL", source: "src_us_holiday_calendar", range: "runtime data", last_updated: "runtime manifest", detail: "输出 event_id、known_at_utc、source_url、timezone 等规范字段。" },
    ],
  },
  {
    symbol: "FOMC_CALENDAR",
    asset_type: "macro_calendar",
    market: "US",
    primary_sources: "src_fomc_calendar",
    price_data: "n/a",
    trade_data: "n/a",
    nbbo_data: "n/a",
    bar_data: "n/a",
    snapshot_data: "n/a",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "meeting / statement / minutes ready",
    coverage_start: "2026 official calendar",
    coverage_end: "forward refresh",
    last_updated: "runtime manifest",
    quality_status: "ready",
    notes: "全局 FOMC 议息日历数据集；用于宏观事件横坐标，不供应个股行情。",
    datasets: [
      { domain: "fomc_meetings", status: "ready", granularity: "meeting day / statement / minutes / dot plot / chair window", source: "Federal Reserve official calendar", range: "2026 forward", last_updated: "runtime manifest", detail: "known_at 使用官方日历拉取时点，避免事后新闻污染。" },
      { domain: "events", status: "ready", granularity: "event_calendar JSONL", source: "src_fomc_calendar", range: "runtime data", last_updated: "runtime manifest", detail: "用于 FOMC 前后路径、波动窗口和规则禁用窗口。" },
    ],
  },
  {
    symbol: "CN_HOLIDAY_CALENDAR",
    asset_type: "calendar",
    market: "CN",
    primary_sources: "src_cn_holiday_calendar",
    price_data: "n/a",
    trade_data: "n/a",
    nbbo_data: "n/a",
    bar_data: "n/a",
    snapshot_data: "n/a",
    option_chain_data: "n/a",
    option_trade_quote_data: "n/a",
    news_event_data: "public holiday / make-up workday ready",
    coverage_start: "2026 public holidays",
    coverage_end: "forward refresh",
    last_updated: "runtime manifest",
    quality_status: "partial",
    notes: "全局中国节假日数据集；当前只供应国务院公众假期和调休，A股/HK Connect 休市待交易所日历叠加。",
    datasets: [
      { domain: "public_holidays", status: "ready", granularity: "holiday window / natural holiday", source: "中国政府网 / 国务院办公厅", range: "2026", last_updated: "runtime manifest", detail: "用于中国节假日和跨市场风险窗口。" },
      { domain: "makeup_workdays", status: "ready", granularity: "adjusted workday", source: "中国政府网 / 国务院办公厅", range: "2026", last_updated: "runtime manifest", detail: "登记调休工作日，不直接等同交易所开市。" },
      { domain: "exchange_sessions", status: "planned", granularity: "A股 / HK Connect close", source: "future exchange official calendars", range: "not loaded", last_updated: "n/a", detail: "接入交易所官方日历后再升级为 ready。" },
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
  consumers: {
    kicker: "Signal Consumers",
    title: "消费渠道管理",
    summary:
      "消费渠道负责接住 Path 或 Agent 产生的信号：先审计记录，再按权限通知、写模拟仓或进入实盘审批。它让每个信号的去向、耗时、结果和风险闸门都能被追踪。",
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
  consumers: [
    ["4 类", "日志、通知、模拟仓、实盘审批"],
    ["Signal", "消费 Path Runtime 的输出信号"],
    ["幂等", "同一信号不能重复通知或重复下单"],
    ["审计优先", "任何下游动作都要先落记录"],
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
    application: {},
    instance: {},
  },
  consumerEntity: "definition",
  consumerSearch: "",
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
  "local:signal_consumption_records": {
    kind: "本地表",
    status: "已登记",
    maskedValue: "signal_consumption_record",
    note: "消费渠道审计记录表，保存每次信号被记录、通知或执行的结果。",
  },
  "local:paper_portfolio_ledger": {
    kind: "本地账本",
    status: "待接入",
    maskedValue: "paper_portfolio_ledger",
    note: "模拟仓账本引用；当前只建消费渠道定义，后续再接成交模拟。",
  },
  "env:DISCORD_WEBHOOK_URL": {
    kind: "环境变量",
    status: "已登记",
    maskedValue: "https://discord.com/api/webhooks/********",
    note: "Discord webhook URL。页面只显示脱敏值，不保存明文 webhook。",
  },
  "config:BROKER_ORDER_API": {
    kind: "配置项",
    status: "未启用",
    maskedValue: "disabled",
    note: "券商实盘交易接口占位；没有人工审批和风控前不启用。",
  },
  "config:BINANCE_STREAM_BASE": {
    kind: "配置项",
    status: "已迁移",
    maskedValue: "replaced by BINANCE_FUTURES_WS_BASE",
    note: "旧 spot/market-data-only 引用；当前保留兼容说明。",
  },
  "config:BINANCE_FUTURES_WS_BASE": {
    kind: "配置项",
    status: "已接入",
    maskedValue: "wss://fstream.binance.com/market/stream?streams=",
    note: "Binance USD-M Futures WebSocket，用于 aggTrade 和 kline_1m。",
  },
  "config:BINANCE_FUTURES_REST_BASE": {
    kind: "配置项",
    status: "已接入",
    maskedValue: "https://fapi.binance.com",
    note: "Binance USD-M Futures REST，用于 /fapi/v1/klines 和 /fapi/v1/ticker/24hr。",
  },
  "config:US_HOLIDAY_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "已接入",
    maskedValue: "https://www.nyse.com/markets/hours-calendars",
    note: "NYSE 官方交易时间和假期页面；本地刷新生成 normalized event JSONL。",
  },
  "config:FOMC_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "已接入",
    maskedValue: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    note: "美联储官方 FOMC 日历；本地刷新生成会议、声明、纪要、点阵图事件。",
  },
  "config:CN_HOLIDAY_CALENDAR_SOURCE": {
    kind: "配置项",
    status: "已接入公众假期",
    maskedValue: "gov.cn official holiday notice",
    note: "国务院办公厅节假日通知；交易所休市日历后续另接。",
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
  replaceRows(pathApplicationRows, payload.pathApplicationRows);
  replaceRows(pathInstanceRows, payload.pathInstanceRows);
  replaceRows(consumerChannelDefinitionRows, payload.consumerChannelDefinitionRows);
  replaceRows(signalConsumptionRecordRows, payload.signalConsumptionRecordRows);
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
  application_id: "应用ID",
  target_symbol: "交易目标",
  target_market: "目标市场",
  target_asset_type: "标的类型",
  parameter_profile: "参数档案",
  monitor_id: "监听ID",
  monitor_script: "监听代码",
  monitor_runtime: "运行环境",
  run_mode: "运行模式",
  runtime_state: "运行状态",
  heartbeat_ref: "心跳引用",
  pid_ref: "PID引用",
  last_heartbeat_at: "最近心跳",
  data_sources: "数据来源",
  output_targets: "输出目标",
  application_result_summary: "应用结论",
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
  channel_type: "渠道类型",
  consumer_stage: "消费阶段",
  signal_contract: "信号契约",
  output_sink_ref: "输出落点",
  delivery_mode: "投递方式",
  idempotency_rule: "幂等规则",
  risk_gate: "风险闸门",
  allowed_actions: "允许动作",
  audit_policy: "审计策略",
  latency_slo: "延迟目标",
  failure_policy: "失败策略",
  channel_id: "渠道ID",
  record_id: "记录ID",
  signal_id: "信号ID",
  signal_type: "信号类型",
  emitted_at_rule: "信号产生框架",
  consumed_at_rule: "消费时间框架",
  decision_payload_ref: "信号载荷引用",
  delivery_status: "投递状态",
  consumer_result: "消费结果",
  latency_ms: "耗时ms",
  error_message: "错误信息",
  audit_state: "审计状态",
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
    application: {
      label: "Path 应用",
      table: "path_application",
      idField: "application_id",
      rows: pathApplicationRows,
    },
    instance: {
      label: "Path 实例",
      table: "path_instance",
      idField: "instance_id",
      rows: pathInstanceRows,
    },
  },
  consumers: {
    definition: {
      label: "消费渠道定义",
      table: "consumer_channel_definition",
      idField: "id",
      rows: consumerChannelDefinitionRows,
    },
    record: {
      label: "信号消费记录",
      table: "signal_consumption_record",
      idField: "record_id",
      rows: signalConsumptionRecordRows,
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
    sourceEntity: "application",
    field: "path_definition_id",
    targetPage: "paths",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "每个 Path 应用必须绑定一个已存在的 Path 定义，再叠加交易目标标的和监听代码。",
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
    sourcePage: "consumers",
    sourceEntity: "record",
    field: "channel_id",
    targetPage: "consumers",
    targetEntity: "definition",
    cardinality: "N:1",
    rule: "每条信号消费记录必须回指一个已登记的消费渠道定义。",
  },
  {
    sourcePage: "consumers",
    sourceEntity: "record",
    field: "path_application_id",
    targetPage: "paths",
    targetEntity: "application",
    cardinality: "N:1 optional",
    rule: "如果信号来自 Path 应用，必须记录 path_application.application_id。",
  },
  {
    sourcePage: "consumers",
    sourceEntity: "record",
    field: "path_instance_id",
    targetPage: "paths",
    targetEntity: "instance",
    cardinality: "N:1 optional",
    rule: "如果信号已经生成 Path 实例，必须记录 path_instance.instance_id。",
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
  { id: "path_app", title: "Path 应用", code: "path_application", page: "paths", entity: "application", x: 830, y: 96 },
  { id: "path_inst", title: "Path 实例", code: "path_instance", page: "paths", entity: "instance", x: 1078, y: 96 },
  { id: "consumer_def", title: "消费渠道定义", code: "consumer_channel_definition", page: "consumers", entity: "definition", x: 830, y: 276 },
  { id: "consumer_rec", title: "信号消费记录", code: "signal_consumption_record", page: "consumers", entity: "record", x: 1078, y: 276 },
  { id: "llm_def", title: "模型接入定义", code: "llm_api_definition", page: "agents", entity: "definition", x: 582, y: 456 },
  { id: "agent_inst", title: "Agent 实例", code: "ai_agent_instance", page: "agents", entity: "instance", x: 830, y: 456 },
  { id: "src_def", title: "数据源头定义", code: "data_source_definition", page: "sources", entity: "definition", x: 26, y: 570 },
  { id: "symbol_map", title: "标的数据地图", code: "symbol_data_map", page: "sources", entity: "map", x: 304, y: 570 },
  { id: "dataset_cov", title: "标的数据域覆盖", code: "symbol_dataset_coverage", page: "sources", entity: "map", x: 582, y: 616 },
];

const specDiagramEdges = [
  { from: "hc_def", to: "hc_occ", label: "实例化 1:N" },
  { from: "vc_def", to: "vc_occ", label: "实例化 1:N" },
  { from: "hc_def", to: "vc_def", label: "依赖/生成 N:N" },
  { from: "hc_def", to: "path_def", label: "Path 使用" },
  { from: "vc_def", to: "path_def", label: "Path 使用" },
  { from: "path_def", to: "path_app", label: "应用 1:N" },
  { from: "path_app", to: "path_inst", label: "生成/回放 1:N" },
  { from: "path_app", to: "consumer_rec", label: "发出信号" },
  { from: "consumer_def", to: "consumer_rec", label: "消费 1:N" },
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
  consumers: "definition",
  agents: "definition",
  sources: "definition",
};

function getPageSearchValue(page = state.page) {
  if (page === "horizontal") return state.horizontalSearch;
  if (page === "vertical") return state.verticalSearch;
  if (page === "paths") return state.pathSearch;
  if (page === "consumers") return state.consumerSearch;
  if (page === "agents") return state.agentSearch;
  if (page === "sources") return state.sourceSearch;
  return state.search;
}

function getPageEntityValue(page = state.page) {
  if (page === "horizontal") return state.horizontalEntity;
  if (page === "vertical") return state.verticalEntity;
  if (page === "paths") return state.pathEntity;
  if (page === "consumers") return state.consumerEntity;
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
  state.consumerSearch = "";
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
    state.pathEntity = ["definition", "application", "instance"].includes(entityParam) ? entityParam : "definition";
    state.pathSearch = q;
    state.selectedPathRecordId = params.get("record") || null;
    state.selectedPathNodeId = params.get("node") || null;
  } else {
    state.pathEntity = pageDefaultEntities.paths;
  }

  if (page === "consumers") {
    state.consumerEntity = entityParam === "record" ? "record" : "definition";
    state.consumerSearch = q;
  } else {
    state.consumerEntity = pageDefaultEntities.consumers;
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
    state.pathEntity = ["definition", "application", "instance"].includes(entity) ? entity : "definition";
    state.pathSearch = search || "";
    if (/^(path_|app_path_|pi_)/.test(search || "")) state.selectedPathRecordId = search;
  }
  if (page === "consumers") {
    state.consumerEntity = entity === "record" ? "record" : "definition";
    state.consumerSearch = search || "";
  }
  if (page === "agents") {
    state.agentEntity = entity === "instance" ? "instance" : "definition";
    state.agentSearch = search || "";
  }
  if (page === "sources") {
    state.sourceEntity = entity === "map" ? "map" : "definition";
    const exactSymbol = entity === "map" && symbolDataMapRows.some((row) => row.symbol === search);
    state.sourceSearch = exactSymbol ? "" : (search || "");
    state.selectedDataSymbol = exactSymbol ? search : null;
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
    state.page === "consumers" ||
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
  if (state.page === "consumers") renderConsumerPage(container);
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
        <svg class="erd-edges" viewBox="0 0 1320 700" aria-hidden="true">
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
    relations.push(makeRelation("看应用", "paths", "application", row.id, "查看这个 Path 定义绑定了哪些交易目标标的", "forward"));
    relations.push(makeRelation("看实例", "paths", "instance", row.id, "查看这个 Path 定义的实盘实例", "forward"));
    appendTokenRelations(relations, "横定义", row.horizontal_definition_ids, "horizontal_definition_ids", "cross");
    appendTokenRelations(relations, "纵定义", row.vertical_definition_ids, "vertical_definition_ids", "cross");
  }
  if (context.page === "paths" && context.entity === "application") {
    relations.push(makeRelation("回定义", "paths", "definition", row.path_definition_id, "回到 Path 定义", "back"));
    relations.push(makeRelation("看实例", "paths", "instance", row.application_id, "查看这个应用生成的实盘实例", "forward"));
    relations.push(makeRelation("消费记录", "consumers", "record", row.application_id, "查看这个应用输出信号的消费记录", "forward"));
  }
  if (context.page === "paths" && context.entity === "instance") {
    relations.push(makeRelation("回定义", "paths", "definition", row.path_definition_id, "回到 Path 定义", "back"));
    relations.push(makeRelation("消费记录", "consumers", "record", row.instance_id, "查看这个实例关联的信号消费记录", "forward"));
    appendTokenRelations(relations, "横实例", row.horizontal_occurrence_ids, "horizontal_occurrence_ids", "cross");
    appendTokenRelations(relations, "纵实例", row.vertical_occurrence_ids, "vertical_occurrence_ids", "cross");
  }
  if (context.page === "consumers" && context.entity === "definition") {
    appendVariablePeekRelations(relations, "输出", row.output_sink_ref, "secret");
    relations.push(makeRelation("消费记录", "consumers", "record", row.id, "查看这个渠道的消费记录", "forward"));
  }
  if (context.page === "consumers" && context.entity === "record") {
    relations.push(makeRelation("渠道定义", "consumers", "definition", row.channel_id, "回到消费渠道定义", "back"));
    appendTokenRelations(relations, "Path应用", row.path_application_id, "path_application_id", "path");
    appendTokenRelations(relations, "Path实例", row.path_instance_id, "path_instance_id", "path");
    appendVariablePeekRelations(relations, "载荷", row.decision_payload_ref, "secret");
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
    "channel_type",
    "delivery_status",
    "audit_state",
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
  return new Set(["credential_ref", "auth_ref", "api_base_ref", "endpoint_ref", "output_sink_ref", "decision_payload_ref"]).has(field);
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
    "path_application_id",
    "path_instance_id",
    "channel_id",
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
  if (/^app_path_/.test(token)) return { page: "paths", entity: "application", search: token };
  if (/^path_/.test(token)) return { page: "paths", entity: "definition", search: token };
  if (/^consumer_/.test(token)) return { page: "consumers", entity: "definition", search: token };
  if (/^consrec_/.test(token)) return { page: "consumers", entity: "record", search: token };
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
  if (field === "path_application_id") {
    return { page: "paths", entity: "application", search: token };
  }
  if (field === "path_instance_id") {
    return { page: "paths", entity: "instance", search: token };
  }
  if (field === "channel_id") {
    return { page: "consumers", entity: "definition", search: token };
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
          { key: "application", label: "应用", code: "path_application", desc: "定义 + 交易目标标的 + 监听代码", count: pathApplicationRows.length },
          { key: "instance", label: "实例", code: "path_instance", desc: "实盘走过的节点和结果回放", count: pathInstanceRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="path-search" type="search" value="${escapeAttr(state.pathSearch)}" placeholder="搜索 ID、节点、标的、状态、监听代码" />
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
      getPathSchemaTitle(),
      "Path 是横坐标和纵坐标之间的状态机；点击列表行进入画板。",
    )}
    ${selectedRecord ? renderPathDrawer(selectedRecord) : ""}
  `;

  attachPathPageEvents(container);
  drawPathEdges(container);
}

function getPathTableConfig() {
  if (state.pathEntity === "definition") {
    return {
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
    };
  }

  if (state.pathEntity === "application") {
    return {
      title: "path_application 应用表",
      desc: "把抽象 Path 定义绑定到交易目标标的，并登记 24h 监听代码、运行状态、心跳和应用结论。",
      schema: pathApplicationSchema,
      rows: pathApplicationRows,
      visibleColumns: [
        "application_id",
        "path_definition_id",
        "name",
        "target_symbol",
        "runtime_state",
        "monitor_script",
        "heartbeat_ref",
        "application_result_summary",
        "status",
      ],
    };
  }

  return {
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
  if (state.pathEntity === "definition") return record.id;
  if (state.pathEntity === "application") return record.application_id;
  return record.instance_id;
}

function getPathRecordTitle(record) {
  if (state.pathEntity === "definition") return record.name;
  if (state.pathEntity === "application") return record.name;
  return record.instance_id;
}

function getPathSchemaTitle() {
  if (state.pathEntity === "definition") return "定义表字段字典";
  if (state.pathEntity === "application") return "应用表字段字典";
  return "实例表字段字典";
}

function getPathEntityCode() {
  if (state.pathEntity === "definition") return "path_definition";
  if (state.pathEntity === "application") return "path_application";
  return "path_instance";
}

function getPathRecordSubtitle(record) {
  if (state.pathEntity === "definition") return record.description;
  if (state.pathEntity === "application") return `${record.target_symbol} · ${record.runtime_state} · ${record.monitor_script}`;
  return record.outcome_label;
}

function getPathCanvasTitle() {
  if (state.pathEntity === "definition") return "定义画板";
  if (state.pathEntity === "application") return "应用监听画板";
  return "实例回放画板";
}

function pathApplicationsForDefinition(pathId) {
  return pathApplicationRows.filter((app) => app.path_definition_id === pathId);
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
          <p class="eyebrow">${getPathEntityCode()}</p>
          <h3>${title}</h3>
          <p>${getPathRecordSubtitle(record)}</p>
        </div>
        <button class="icon-button" type="button" data-close-path-drawer aria-label="关闭抽屉">×</button>
      </div>
      <div class="path-drawer-body">
        <div class="path-record-summary">
          ${renderPathRecordSummary(record)}
        </div>
        <div class="path-canvas-shell">
          <div class="path-canvas-header">
            <strong>${getPathCanvasTitle()}</strong>
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
  let rows;
  if (state.pathEntity === "definition") {
    const applications = pathApplicationsForDefinition(record.id);
    const applicationStatus = applications.length
      ? applications.map((app) => `${app.target_symbol}: ${app.runtime_state} (${app.monitor_script})`).join("；")
      : "暂无应用";
    rows = [
      ["状态", record.status],
      ["Path 家族", record.path_family],
      ["应用状态", applicationStatus],
      ["资金假设", record.flow_hypothesis],
      ["失效条件", record.invalidation_rule],
    ];
  } else if (state.pathEntity === "application") {
    rows = [
      ["状态", record.runtime_state],
      ["目标标的", record.target_symbol],
      ["Path 定义", record.path_definition_id],
      ["监听代码", record.monitor_script],
      ["心跳", record.heartbeat_ref],
      ["PID", record.pid_ref],
    ];
  } else {
    rows = [
      ["状态", record.activation_state],
      ["标的", record.symbols],
      ["当前节点", record.current_node_id],
      ["人工复盘", record.human_review_state],
    ];
  }

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
  if (state.pathEntity === "definition" || state.pathEntity === "application") {
    return { nodes: pathCanvasDefinitions, edges: pathCanvasDefinitionEdges };
  }
  return { nodes: pathCanvasInstances, edges: pathCanvasInstanceEdges };
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
  const positions = state.pathCanvasPositions[state.pathEntity] || {};
  return positions[node.id] || { x: node.x, y: node.y };
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
      if (!state.pathCanvasPositions[state.pathEntity]) state.pathCanvasPositions[state.pathEntity] = {};
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
    <p class="eyebrow">${state.pathEntity === "instance" ? "Observed Node" : "Path Node"}</p>
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

function renderConsumerPage(container) {
  const table =
    state.consumerEntity === "definition"
      ? {
          title: "consumer_channel_definition 定义表",
          desc: "定义信号下游怎么消费：记录、通知、模拟仓、实盘审批。每个渠道都要有幂等、风险闸门和审计策略。",
          schema: consumerChannelDefinitionSchema,
          rows: consumerChannelDefinitionRows,
          visibleColumns: [
            "id",
            "name",
            "channel_type",
            "consumer_stage",
            "output_sink_ref",
            "delivery_mode",
            "risk_gate",
            "status",
          ],
        }
      : {
          title: "signal_consumption_record 消费记录表",
          desc: "记录某次 Path 或 Agent 信号被哪个渠道消费，以及投递状态、耗时、结果和审计状态。",
          schema: signalConsumptionRecordSchema,
          rows: signalConsumptionRecordRows,
          visibleColumns: [
            "record_id",
            "channel_id",
            "path_application_id",
            "path_instance_id",
            "signal_id",
            "signal_type",
            "symbol",
            "delivery_status",
            "consumer_result",
            "latency_ms",
            "audit_state",
          ],
        };

  const query = state.consumerSearch.trim().toLowerCase();
  const rows = table.rows.filter((row) => {
    if (!query) return true;
    return Object.values(row).join(" ").toLowerCase().includes(query);
  });
  table.context = { page: "consumers", entity: state.consumerEntity };

  container.innerHTML = `
    <section class="entity-panel">
      <div class="entity-header">
        <div class="entity-title-block">
          <h3>${table.title}</h3>
          <p>${table.desc}</p>
        </div>
      </div>
      ${renderEntitySwitcher({
        ariaLabel: "消费渠道实体切换",
        dataName: "consumer-entity",
        current: state.consumerEntity,
        options: [
          { key: "definition", label: "渠道定义", code: "consumer_channel_definition", desc: "日志、通知、模拟仓、live 渠道", count: consumerChannelDefinitionRows.length },
          { key: "record", label: "消费记录", code: "signal_consumption_record", desc: "每次信号被消费后的结果", count: signalConsumptionRecordRows.length },
        ],
      })}
      <div class="entity-toolbar">
        <input class="search-box" id="consumer-search" type="search" value="${escapeAttr(state.consumerSearch)}" placeholder="搜索渠道、信号、Path 应用、投递状态" />
        <span class="field-line">${rows.length} / ${table.rows.length} 条记录</span>
      </div>
      <div class="entity-table-wrap">
        <table class="entity-table consumer-entity-table">
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
                : `<tr><td colspan="${table.visibleColumns.length + 1}">${table.rows.length ? "没有匹配记录。" : "还没有信号消费记录；Path Runtime 产生信号后会写入这里。"}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>

    ${renderSchemaDetails(
      table,
      state.consumerEntity === "definition" ? "消费渠道字段字典" : "消费记录字段字典",
      state.consumerEntity === "definition" ? "定义表描述下游能力与权限，不保存明文 webhook 或券商密钥。" : "记录表保存信号被消费后的状态、耗时和结果，给复盘和风控追踪用。",
    )}
  `;

  container.querySelectorAll("[data-consumer-entity]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consumerEntity = button.dataset.consumerEntity;
      state.consumerSearch = "";
      render();
      syncRoute();
    });
  });
  bindSearchInput(container.querySelector("#consumer-search"), (value) => {
    state.consumerSearch = value;
  });
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
