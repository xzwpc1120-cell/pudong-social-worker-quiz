"use client";

import { useEffect, useMemo, useState } from "react";
import { EXTRA_QUESTIONS } from "./extra-questions";

export type QuestionType = "single"|"multiple"|"judge";
export type Question = { id: number; category: string; period: string; stem: string; options: string[]; answer: number|number[]; explanation: string; type?: QuestionType; visual?: string };
type UserProfile = { name: string; id: string; createdAt: number };

const CORE_BANK: Question[] = [
  {id:1,category:"政治理论",period:"2026上半年相关",stem:"新时代坚持和发展中国特色社会主义的根本立场是（ ）。",options:["以经济建设为中心","坚持以人民为中心","全面深化改革","推动高质量发展"],answer:1,explanation:"以人民为中心是新时代坚持和发展中国特色社会主义的根本立场。"},
  {id:2,category:"政治理论",period:"2025上半年相关",stem:"全过程人民民主的本质属性是（ ）。",options:["最广泛、最真实、最管用的民主","选举民主","协商民主","基层民主"],answer:0,explanation:"全过程人民民主是最广泛、最真实、最管用的社会主义民主。"},
  {id:3,category:"法律常识",period:"2025下半年相关",stem:"根据《民法典》，不满八周岁的未成年人属于（ ）。",options:["完全民事行为能力人","限制民事行为能力人","无民事行为能力人","视为完全民事行为能力人"],answer:2,explanation:"不满八周岁的未成年人为无民事行为能力人，由其法定代理人代理实施民事法律行为。"},
  {id:4,category:"法律常识",period:"2026上半年相关",stem:"居民委员会是居民自我管理、自我教育、自我服务的（ ）。",options:["基层政权机关","基层群众性自治组织","事业单位","社会团体"],answer:1,explanation:"《宪法》和《城市居民委员会组织法》明确居民委员会是基层群众性自治组织。"},
  {id:5,category:"社区治理",period:"2025上半年相关",stem:"社区议事协商中，面对多方利益分歧，社工首先应当（ ）。",options:["替居民作出决定","回避争议","充分听取并梳理各方诉求","将问题全部移交上级"],answer:2,explanation:"协商的前提是识别利益相关方并充分了解各方诉求，再寻找共同点。"},
  {id:6,category:"社区治理",period:"2025下半年相关",stem:"“三社联动”通常指社区、社会组织和（ ）之间的联动。",options:["社会企业","社会工作者","社会媒体","社会保障"],answer:1,explanation:"三社联动通常指社区、社会组织与社会工作者协同参与基层治理。"},
  {id:7,category:"社区治理",period:"2026上半年相关",stem:"开展社区需求调查时，为提高样本代表性，较适宜采用（ ）。",options:["只访问熟悉居民","只听取居委干部意见","分层抽样并结合访谈","仅收集网络留言"],answer:2,explanation:"分层抽样能覆盖不同群体，访谈可补充量化调查难以呈现的信息。"},
  {id:8,category:"社工实务",period:"2025上半年相关",stem:"社会工作专业关系中，“接纳”是指（ ）。",options:["认同服务对象的一切行为","尊重其独特性和价值，不随意评判","替其承担全部责任","满足其所有要求"],answer:1,explanation:"接纳是尊重人的价值并避免标签化，不等于赞同行为或无条件满足要求。"},
  {id:9,category:"社工实务",period:"2025下半年相关",stem:"服务对象透露可能伤害他人的具体计划时，社工处理保密原则的正确做法是（ ）。",options:["绝对保密","立即公开全部资料","评估风险并按必要范围报告","结束服务"],answer:2,explanation:"存在明确伤害风险时需启动风险评估与必要通报，但仍应遵循最小披露原则。"},
  {id:10,category:"言语理解",period:"2025上半年相关",stem:"基层治理既要讲力度，也要有温度。最恰当的理解是（ ）。",options:["严格执法与人文关怀应相结合","人情可以取代制度","治理只需提高效率","温度比规则更重要"],answer:0,explanation:"题干强调力度与温度并重，即规范治理与人文关怀相统一。"},
  {id:11,category:"判断推理",period:"2025下半年相关",stem:"所有网格员都参加培训；小李是网格员。由此必然推出（ ）。",options:["小李组织了培训","参加培训的都是网格员","小李参加了培训","小李培训成绩优秀"],answer:2,explanation:"由“所有A都是B”和“小李是A”，可必然推出“小李是B”。"},
  {id:12,category:"数量关系",period:"2026上半年相关",stem:"某社区志愿者人数由80人增加到100人，增长率为（ ）。",options:["20%","25%","30%","80%"],answer:1,explanation:"增长率=(100−80)÷80=25%。"},
  {id:13,category:"公基常识",period:"2025上半年相关",stem:"公文中适用于公布行政法规和规章、宣布施行重大强制性措施的文种是（ ）。",options:["通知","通告","命令（令）","函"],answer:2,explanation:"命令（令）适用于公布行政法规和规章、宣布施行重大强制性措施等。"},
  {id:14,category:"公基常识",period:"2025下半年相关",stem:"通货膨胀通常表现为（ ）。",options:["一般物价水平持续上涨","所有商品价格同时下降","就业率必然为零","货币购买力持续增强"],answer:0,explanation:"通货膨胀的典型表现是一般物价水平持续、普遍上涨和货币购买力下降。"},
  {id:15,category:"市情区情",period:"2026上半年相关",stem:"中国（上海）自由贸易试验区于哪一年正式挂牌成立？",options:["1990年","2001年","2013年","2020年"],answer:2,explanation:"中国（上海）自由贸易试验区于2013年9月正式挂牌。"},
  {id:16,category:"市情区情",period:"2025下半年相关",stem:"浦东开发开放的标志性年份是（ ）。",options:["1978年","1990年","2008年","2018年"],answer:1,explanation:"1990年4月，党中央、国务院正式宣布开发开放浦东。"},
  {id:17,category:"判断推理",period:"2026上半年相关",stem:"社区A开展垃圾分类后投放准确率提高。要说明是宣传活动起了作用，最需要补充（ ）。",options:["社区A人口更多","同期无其他重大干预且居民参与宣传","垃圾桶颜色不同","其他社区也开展宣传"],answer:1,explanation:"因果判断需尽量排除其他变量，并确认目标群体实际接受了干预。"},
  {id:18,category:"社区治理",period:"2025上半年相关",stem:"老旧小区加装电梯协商中，低楼层居民反对。最合适的工作方式是（ ）。",options:["多数表决后不再沟通","公开指责反对者","搭建议事平台并协商补偿与方案优化","要求低楼层无条件服从"],answer:2,explanation:"应搭建协商平台，呈现各方利益，通过方案优化和合理补偿争取共识。"},
  {id:19,category:"法律常识",period:"2025下半年相关",stem:"行政机关作出影响当事人重大权益的决定前，通常应保障其（ ）。",options:["沉默权和继承权","陈述权和申辩权","选举权和被选举权","著作权和专利权"],answer:1,explanation:"程序正当要求依法保障当事人的知情、陈述和申辩等权利。"},
  {id:20,category:"社工实务",period:"2026上半年相关",stem:"危机介入的首要任务通常是（ ）。",options:["撰写长期发展规划","确保当事人及他人安全","开展大型社区活动","建立学术模型"],answer:1,explanation:"危机介入首先评估并处理自伤、伤人等紧急风险，确保安全。"},
  {id:21,category:"公基常识",period:"2026上半年相关",stem:"“草木皆兵”与下列哪场战役有关？",options:["赤壁之战","淝水之战","官渡之战","夷陵之战"],answer:1,explanation:"“草木皆兵”“风声鹤唳”均与淝水之战有关。"},
  {id:22,category:"言语理解",period:"2025下半年相关",stem:"填入句中最恰当的词语：基层工作千头万绪，只有把群众的“小事”当作自己的“大事”，才能真正____民心。",options:["消耗","凝聚","回避","替代"],answer:1,explanation:"“凝聚民心”搭配恰当，且符合句意。"},
  {id:23,category:"数量关系",period:"2025上半年相关",stem:"4名社工3天走访120户，效率相同。6名社工5天可走访多少户？",options:["240户","260户","280户","300户"],answer:3,explanation:"每人每天走访120÷4÷3=10户，6×5×10=300户。"},
  {id:24,category:"社区治理",period:"2026上半年相关",stem:"社区活动评估中，“实际参与人数占目标人数的比例”属于（ ）。",options:["过程或产出指标","宏观经济指标","伦理指标","法律效力指标"],answer:0,explanation:"参与人数及覆盖比例用于衡量活动执行和直接产出。"},
  {id:25,category:"政治理论",period:"2025下半年相关",stem:"推进基层治理现代化，应当把加强基层党的建设、巩固党的执政基础作为（ ）。",options:["贯穿社会治理和基层建设的一条红线","临时措施","市场主体职责","居民个人事务"],answer:0,explanation:"加强基层党的建设、巩固党的执政基础应贯穿基层治理和基层建设。"},
  {id:26,category:"法律常识",period:"2025上半年相关",stem:"个人信息处理应当遵循合法、正当、必要和（ ）原则。",options:["无限收集","诚信","公开交易","永久保存"],answer:1,explanation:"《个人信息保护法》规定处理个人信息应遵循合法、正当、必要和诚信原则。"},
  {id:27,category:"社工实务",period:"2026上半年相关",stem:"面对不断打断谈话的服务对象家属，较合适的回应是（ ）。",options:["立即终止谈话","指责对方不礼貌","先认可其关切，再约定轮流表达","只与服务对象沟通"],answer:2,explanation:"先共情并设置清晰沟通规则，有利于兼顾关系与会谈秩序。"},
  {id:28,category:"社区治理",period:"2025下半年相关",stem:"社区资源链接的正确顺序通常是（ ）。",options:["直接承诺—寻找资源—了解需求","需求评估—资源盘点—匹配链接—跟踪反馈","公开隐私—发动捐款—结束服务","资源先到先得"],answer:1,explanation:"资源链接应基于需求评估，完成盘点与匹配后还需跟踪效果。"},
  {id:29,category:"公基常识",period:"2025上半年相关",stem:"请示与报告的主要区别之一是（ ）。",options:["请示要求上级答复，报告一般不要求批复","报告只能事前行文","请示可一文多事","二者完全相同"],answer:0,explanation:"请示具有请求性，原则上一文一事并需上级答复；报告主要用于汇报，一般不要求批复。"},
  {id:30,category:"市情区情",period:"2026上半年相关",stem:"浦东新区行政区划代码为（ ）。",options:["310101","310104","310115","310151"],answer:2,explanation:"上海市浦东新区行政区划代码为310115。"},
  {id:31,type:"judge",category:"社工实务",period:"2025上半年相关",stem:"社会工作者对服务对象负有保密义务，因此任何情况下都不得披露资料。",options:["正确","错误"],answer:1,explanation:"保密并非绝对；遇到明确伤害风险、法律规定等情形，可按最小必要范围披露。"},
  {id:32,type:"judge",category:"社区治理",period:"2025上半年相关",stem:"社区需求评估既可以使用问卷等定量方法，也可以使用访谈等定性方法。",options:["正确","错误"],answer:0,explanation:"综合使用定量与定性方法，有助于更完整地识别社区需求。"},
  {id:33,type:"judge",category:"法律常识",period:"2025上半年相关",stem:"居民委员会属于城市基层人民政府的派出机关。",options:["正确","错误"],answer:1,explanation:"居民委员会是基层群众性自治组织，不是基层政府的派出机关。"},
  {id:34,type:"judge",category:"社工实务",period:"2025下半年相关",stem:"个案工作结案后，社会工作者无需再对服务效果进行跟进。",options:["正确","错误"],answer:1,explanation:"必要的跟进有助于评估服务成效、巩固改变并处理可能出现的新问题。"},
  {id:35,type:"judge",category:"社区治理",period:"2025下半年相关",stem:"社区协商应当尽可能保障利益相关方平等表达意见。",options:["正确","错误"],answer:0,explanation:"平等参与、充分表达和理性协商是形成社区共识的重要基础。"},
  {id:36,type:"judge",category:"法律常识",period:"2025下半年相关",stem:"处理个人信息时，只要技术上可以收集，就可以无限扩大收集范围。",options:["正确","错误"],answer:1,explanation:"个人信息处理应遵循合法、正当、必要和诚信原则，不得过度收集。"},
  {id:37,type:"judge",category:"社工实务",period:"2026上半年相关",stem:"危机介入时，应优先评估服务对象是否存在自伤或伤人风险。",options:["正确","错误"],answer:0,explanation:"确保当事人及他人安全是危机介入的首要任务。"},
  {id:38,type:"judge",category:"社区治理",period:"2026上半年相关",stem:"居民参与社区治理仅指参加社区组织的线下活动。",options:["正确","错误"],answer:1,explanation:"居民参与还包括议事协商、志愿服务、线上建言、民主监督等多种形式。"},
  {id:39,type:"judge",category:"政治理论",period:"2026上半年相关",stem:"基层治理应坚持以人民为中心，把增进民生福祉作为重要目标。",options:["正确","错误"],answer:0,explanation:"以人民为中心要求治理回应群众需求、维护群众利益、增进民生福祉。"},
  {id:40,type:"multiple",category:"社工实务",period:"2025上半年相关",stem:"社会工作者建立专业关系时，适宜采取的做法有（ ）。",options:["尊重服务对象的选择","清晰说明服务边界","随意承诺无法实现的事项","保护服务对象隐私"],answer:[0,1,3],explanation:"建立专业关系应尊重自决、说明边界并保护隐私，不能作不切实际的承诺。"},
  {id:41,type:"multiple",category:"社区治理",period:"2025上半年相关",stem:"开展社区需求调查，可采用的方法有（ ）。",options:["问卷调查","焦点小组","入户访谈","仅凭个人经验判断"],answer:[0,1,2],explanation:"问卷、焦点小组和入户访谈均是常用调查方法，不能只凭个人经验。"},
  {id:42,type:"multiple",category:"公基常识",period:"2025上半年相关",stem:"一份规范的事项性通知通常应写明（ ）。",options:["事项内容","时间地点","参加对象或执行主体","必要的工作要求"],answer:[0,1,2,3],explanation:"通知应让接收者明确谁在何时何地做什么，以及具体执行要求。"},
  {id:43,type:"multiple",category:"社工实务",period:"2025下半年相关",stem:"社区资源通常包括（ ）。",options:["人力资源","场地设施","组织与政策资源","居民关系网络"],answer:[0,1,2,3],explanation:"社区资源既包括有形资源，也包括组织、政策、关系网络等无形资源。"},
  {id:44,type:"multiple",category:"法律常识",period:"2025下半年相关",stem:"个人信息处理者应采取的适当措施有（ ）。",options:["明确处理目的","限定必要范围","保障信息安全","未经同意任意公开"],answer:[0,1,2],explanation:"信息处理应目的明确、范围必要并采取安全措施，不能任意公开。"},
  {id:45,type:"multiple",category:"社区治理",period:"2025下半年相关",stem:"推动老旧小区加装电梯协商，可采取的措施有（ ）。",options:["公开方案和信息","充分听取各楼层意见","研究合理补偿方案","回避反对意见"],answer:[0,1,2],explanation:"充分公开、表达与利益协调有助于形成共识，回避分歧不能解决问题。"},
  {id:46,type:"multiple",category:"社工实务",period:"2026上半年相关",stem:"社会工作专业伦理的核心原则包括（ ）。",options:["尊重人的尊严和价值","促进社会公正","重视服务对象自决","以个人好恶代替专业判断"],answer:[0,1,2],explanation:"尊重、公正与自决是重要伦理原则，专业判断不能由个人好恶支配。"},
  {id:47,type:"multiple",category:"社区治理",period:"2026上半年相关",stem:"提升社区应急治理能力，需要（ ）。",options:["完善应急预案","定期开展演练","建立重点人群台账","完全依赖临时处置"],answer:[0,1,2],explanation:"预案、演练和重点人群支持是应急治理的基础，不能只靠临时处置。"},
  {id:48,type:"multiple",category:"政治理论",period:"2026上半年相关",stem:"发展全过程人民民主，应当体现（ ）。",options:["过程民主与成果民主相统一","程序民主与实质民主相统一","直接民主与间接民主相统一","人民民主与国家意志相统一"],answer:[0,1,2,3],explanation:"全过程人民民主强调多组民主形式和治理环节的有机统一。"},
  {id:49,category:"图像逻辑",period:"2025上半年相关",stem:"观察图形序列，问号处最适合填入哪一项？",visual:"▲  △  ▲  △  ?",options:["▲","■","●","◆"],answer:0,explanation:"实心三角与空心三角交替出现，问号处应为实心三角。"},
  {id:50,category:"图像逻辑",period:"2025上半年相关",stem:"观察图形数量变化，问号处最适合填入哪一项？",visual:"●  ●●  ●●●  ?",options:["●●","●●●●","○○○○","●●●●●"],answer:1,explanation:"每组依次增加一个实心圆，下一组应有4个实心圆。"},
  {id:51,category:"图像逻辑",period:"2025上半年相关",stem:"下列图形中，与其他三项规律不同的是（ ）。",visual:"分类规律：外框与内部符号",options:["□○","△○","◇○","○○"],answer:3,explanation:"前三项均为一种封闭外框包含圆形；第四项内外均为圆形，结构关系不同。"},
  {id:52,category:"图像逻辑",period:"2025下半年相关",stem:"按照顺时针旋转规律，问号处应为（ ）。",visual:"↑  →  ↓  ?",options:["←","↑","↗","↙"],answer:0,explanation:"箭头每次顺时针旋转90度，向下之后应向左。"},
  {id:53,category:"图像逻辑",period:"2025下半年相关",stem:"按照交替规律，问号处应为（ ）。",visual:"■  ○  ■  ○  ?",options:["○","□","■","△"],answer:2,explanation:"实心方块与空心圆交替出现。"},
  {id:54,category:"图像逻辑",period:"2025下半年相关",stem:"依据图形叠加后的数量规律，问号处应为（ ）。",visual:"△ → △△ → △△△ → ?",options:["△△","△△△△","▲▲▲▲","△△△△△"],answer:1,explanation:"空心三角数量依次增加1个，下一项为4个空心三角。"},
  {id:55,category:"图像逻辑",period:"2026上半年相关",stem:"按照方向与填充状态的共同规律，问号处应为（ ）。",visual:"▲  ▷  ▼  ◁  ?",options:["▲","△","▶","▼"],answer:0,explanation:"方向每次顺时针旋转90度，且实心、空心交替；下一项为向上的实心三角。"},
  {id:56,category:"图像逻辑",period:"2026上半年相关",stem:"下列哪一项可以延续序列规律？",visual:"●□  □●  ●□  ?",options:["●□","□●","●●","□□"],answer:1,explanation:"圆与方块的位置左右交替，下一项应为方块在左、圆在右。"},
  {id:57,category:"图像逻辑",period:"2026上半年相关",stem:"九宫格同一行中，第三格由前两格的符号数量相加得到。问号处应为（ ）。",visual:"第一行：● + ●● = ●●●　第二行：■ + ■■ = ?",options:["■■","■■■","●●●","■■■■"],answer:1,explanation:"同一行第三格为前两格符号数量之和，1个方块加2个方块得到3个方块。"},
];
const BANK:Question[]=[...CORE_BANK,...EXTRA_QUESTIONS];

const ARTICLES = [
  {type:"公文",title:"关于开展社区安全隐患排查的通知",body:"各居民区、相关单位：\n为进一步筑牢社区安全防线，现决定开展安全隐患集中排查。请重点检查消防通道、电动自行车充电、燃气使用及独居老人居住环境。各单位要建立问题清单，明确责任人和整改时限，于6月20日前报送排查情况。\n特此通知。\n××街道办事处\n2026年6月10日",tips:"标题＋主送机关＋缘由事项＋具体要求＋落款日期。通知重在明确“谁、何时、做什么、怎么报”。"},
  {type:"公告",title:"社区公共活动空间临时闭馆公告",body:"因设施检修，社区公共活动空间将于2026年7月8日8:00至7月10日18:00暂停开放，7月11日起恢复正常服务。闭馆期间给您带来的不便，敬请谅解。咨询电话：021-××××××××。\n特此公告。\n××社区居民委员会\n2026年7月5日",tips:"公告对象广泛，语言简明、信息准确；写清原因、范围、起止时间、恢复安排和咨询方式。"},
  {type:"倡议书",title:"共建清洁家园倡议书",body:"居民朋友们：\n整洁有序的社区环境需要每个人共同守护。我们倡议：从家庭做起，准确分类投放垃圾；从楼道做起，不堆放杂物、不占用消防通道；从邻里做起，主动劝阻不文明行为；从志愿服务做起，积极参加周末清洁行动。让我们以点滴行动汇聚文明力量，共建安全、宜居、温暖的美好家园！\n××社区居民委员会\n2026年5月20日",tips:"倡议书要有明确对象、背景目的、可执行的分项倡议和有感染力的号召。"},
  {type:"材料作文",title:"把群众的小事办成治理的大事",body:"基层治理的成效，最终体现在群众一件件具体的小事里。楼道灯是否明亮，养老服务是否便捷，矛盾纠纷能否及时化解，看似琐碎，却共同构成居民对美好生活最直接的感受。\n办好群众小事，首先要俯下身听需求。只有走出办公室，走进楼组和家庭，才能发现报表之外的真实困难。其次要善于协同破难题。基层问题往往涉及多个主体，需要党组织引领，社区、社会组织、物业和居民共同参与。最后要形成长效机制，把一次解决转化为一类问题的制度化治理。\n小事连着民心，民心汇聚力量。以耐心回应诉求，以专业链接资源，以制度巩固成果，基层工作者就能在平凡岗位上写好为民服务的大文章。",tips:"结构参考：提出中心论点—三个递进分论点—回扣主题。论据贴近社区，避免空泛口号。"},
  {type:"通知",title:"关于举办社区便民服务日活动的通知",body:"各居民区、辖区共建单位：\n为进一步整合社区服务资源，提升居民获得感，街道定于2026年8月16日9:00—15:00在社区文化广场举办便民服务日活动。活动设置健康咨询、法律援助、家电维修、就业指导等服务专区。请各居民区做好宣传发动和需求摸排，各共建单位于8月10日前报送参与人员及服务项目。活动当天请提前30分钟到场，服从现场统一安排。\n特此通知。\n××街道办事处\n2026年8月2日",tips:"事项性通知应依次交代目的、时间地点、参加对象、活动内容、工作要求和报送节点。"},
  {type:"通报",title:"关于社区防汛应急演练情况的通报",body:"各居民区、相关单位：\n7月12日，街道组织开展防汛防台应急演练。多数单位响应迅速、分工明确，顺利完成预警发布、人员转移和物资调配等科目。但检查发现，个别点位存在应急联系人不熟悉流程、沙袋储备不足、台账更新不及时等问题。\n各单位要对照问题清单立即整改，于7月20日前完成物资补充和流程再培训，并将整改情况报街道应急管理办公室。下一步，街道将适时开展抽查。\n××街道办事处\n2026年7月15日",tips:"通报一般包括事实情况、评价或问题、处理意见和下一步要求，语气客观明确。"},
  {type:"请示",title:"关于增设社区助餐服务点的请示",body:"××街道办事处：\n我社区现有60岁以上老年居民1,280人，其中高龄、独居老人186人。现有助餐点距离部分居民区较远，难以满足就近用餐需求。经前期走访和场地勘察，拟在邻里中心一楼增设助餐服务点，建筑面积约80平方米，预计每日服务120人次。项目拟通过政府购买服务方式运营，所需改造经费约15万元。\n妥否，请批示。\n××社区居民委员会\n2026年6月18日",tips:"请示须一文一事，说明背景、依据、具体请求及可行性，结尾使用“妥否，请批示”。"},
  {type:"报告",title:"关于独居老人关爱服务开展情况的报告",body:"××街道办事处：\n今年以来，我社区围绕独居老人安全与情感支持需求，更新重点关爱对象台账，组建由社工、家庭医生和志愿者组成的服务队，累计完成电话问候860人次、上门探访326人次，协助解决就医配药、居家维修等问题47件。\n工作中仍存在志愿力量不稳定、紧急呼叫设备覆盖不足等问题。下一步，社区将完善分级关爱机制，加强志愿者培训，并链接社会资源扩大智能设备覆盖。\n特此报告。\n××社区居民委员会\n2026年6月30日",tips:"报告以汇报情况为主，可写成绩、做法、问题和下一步计划，但不夹带请示事项。"},
  {type:"材料作文",title:"以协商之力绘就社区共治同心圆",body:"社区是城市治理的基本单元，也是不同利益诉求交汇的公共空间。停车位如何分配、公共空间怎样使用、老旧设施是否改造，单靠行政命令难以获得持久认同。用好协商这把钥匙，才能让社区治理从“替民做主”走向“由民作主”。\n协商共治，要让多元主体有序参与。社区党组织应发挥统筹作用，主动邀请居民、物业、业委会、社会组织等利益相关方共同议事。协商共治，要以事实和规则凝聚共识。充分公开信息、明确议事规则，才能避免情绪对立。协商共治，还要推动成果落地，明确责任清单、办理时限和反馈方式，让居民看到议而有决、决而有行。\n众人的事情由众人商量，是人民民主的真谛。把协商嵌入社区治理全过程，就能将多元诉求转化为共同方案，将“陌邻”变成“睦邻”，绘就人人参与、人人负责、人人共享的社区共治同心圆。",tips:"可围绕“主体参与—规则保障—成果落实”展开，既写价值意义，也写操作路径。"},
  {type:"材料作文",title:"让数字技术更好服务基层治理",body:"数字平台让数据多跑路、群众少跑腿，也为精准发现需求、快速处置问题提供了新工具。然而，重平台轻服务、重复填报、老年人使用不便等现象提醒我们：技术只有融入真实治理场景，才能释放价值。\n数字赋能首先应坚持需求导向，从居民和基层工作者的实际痛点出发，整合重复系统，优化办事流程。其次应守住公平与安全底线，保留必要的线下服务，帮助老年人等群体跨越数字鸿沟，并依法保护个人信息。最后应促进线上线下协同，数据发现问题后，还要靠社工走访、部门联动和居民参与把问题解决在现场。\n技术的温度取决于治理者的态度。坚持以人为本、实用为先、安全为基，才能让数字工具减轻基层负担、提升服务质效，为社区治理现代化注入持久动力。",tips:"数字治理类作文避免只讲技术优势，应同时分析形式主义、数字鸿沟和隐私风险。"},
  {type:"材料作文",title:"在志愿服务中汇聚社区温度",body:"志愿服务是社区互助精神最生动的表达。从助老送餐到环境整治，从儿童陪伴到应急支援，一次次力所能及的行动，让居民由社区生活的旁观者成为建设者。\n让志愿服务持续焕发生机，需要精准对接需求。社区应通过走访、问卷和议事会建立需求清单，让服务送到真正需要的地方；需要完善组织保障，做好培训、保险、激励和资源支持，让热情转化为专业、稳定的行动；需要培育自治力量，鼓励居民发挥技能特长，孵化常态化志愿团队，形成“有时间做志愿者、有困难找志愿者”的良好循环。\n微光成炬，涓滴成河。把居民善意组织起来，把社区资源链接起来，志愿服务就能成为增进邻里信任、提升治理韧性的重要力量，让社区更有温度、更具活力。",tips:"志愿服务主题可从需求匹配、机制保障、居民自治三个角度提出对策。"},
];

function shuffle<T>(items:T[]) { return [...items].sort(()=>Math.random()-.5); }
const LETTERS = ["A","B","C","D"];
const TYPE_LABELS:Record<QuestionType|string,string>={single:"单选题",multiple:"多选题",judge:"判断题",mixed:"综合练习"};
const questionType=(q:Question):QuestionType=>q.type||"single";
const answerKey=(q:Question)=>Array.isArray(q.answer)?q.answer:[q.answer];
const sameAnswer=(q:Question,value:number[]|undefined)=>!!value&&answerKey(q).length===value.length&&answerKey(q).every(item=>value.includes(item));
const answerText=(q:Question,value:number[]|undefined)=>!value?.length?"未作答":value.map(i=>`${LETTERS[i]}. ${q.options[i]}`).join("；");

export default function Home() {
  const [user,setUser]=useState<UserProfile|null>(null); const [authReady,setAuthReady]=useState(false);
  const [authMode,setAuthMode]=useState<"login"|"register">("login"); const [username,setUsername]=useState(""); const [authError,setAuthError]=useState("");
  const [view,setView]=useState<"home"|"quiz"|"result"|"mistakes">("home");
  const [practiceType,setPracticeType]=useState<QuestionType|"mixed">("mixed"); const [count,setCount]=useState(15); const [paper,setPaper]=useState<Question[]>([]);
  const [answers,setAnswers]=useState<Record<number,number[]>>({}); const [confirmed,setConfirmed]=useState<Record<number,boolean>>({}); const [submitted,setSubmitted]=useState(false);
  const [mistakeIds,setMistakeIds]=useState<number[]>([]); const [openArticle,setOpenArticle]=useState<number|null>(null);
  const [filter,setFilter]=useState("全部");
  useEffect(()=>{try{const users:UserProfile[]=JSON.parse(localStorage.getItem("pudong-users")||"[]");const id=localStorage.getItem("pudong-current-user");setUser(users.find(item=>item.id===id)||null)}catch{}finally{setAuthReady(true)}},[]);
  useEffect(()=>{if(!user){setMistakeIds([]);return}try{setMistakeIds(JSON.parse(localStorage.getItem(`pudong-mistakes:${user.id}`)||"[]"))}catch{setMistakeIds([])}},[user]);
  const saveMistakes=(ids:number[])=>{setMistakeIds(ids);if(user)localStorage.setItem(`pudong-mistakes:${user.id}`,JSON.stringify(ids))};
  const cleanName=()=>username.trim().replace(/\s+/g," ");
  const enter=(profile:UserProfile)=>{setUser(profile);localStorage.setItem("pudong-current-user",profile.id);setUsername("");setAuthError("");setView("home")};
  const authenticate=()=>{const name=cleanName();if(name.length<2||name.length>20){setAuthError("用户名请输入 2—20 个字符");return}let users:UserProfile[]=[];try{users=JSON.parse(localStorage.getItem("pudong-users")||"[]")}catch{}const found=users.find(item=>item.name.toLocaleLowerCase()===name.toLocaleLowerCase());if(authMode==="login"){if(!found){setAuthError("未找到该用户，请先注册");return}enter(found);return}if(found){setAuthError("用户名已注册，请直接登录");return}const token=typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID().replaceAll("-","").slice(0,10):`${Date.now()}${Math.random()}`.replace(".","").slice(-10);const profile={name,id:`PD-${token.toUpperCase()}`,createdAt:Date.now()};localStorage.setItem("pudong-users",JSON.stringify([...users,profile]));enter(profile)};
  const logout=()=>{localStorage.removeItem("pudong-current-user");setUser(null);setAnswers({});setConfirmed({});setPaper([]);setView("home")};
  const sourceForType=(type=practiceType)=>type==="mixed"?BANK:BANK.filter(q=>questionType(q)===type);
  const start=(mistakes=false)=>{const source=mistakes?BANK.filter(q=>mistakeIds.includes(q.id)):sourceForType();setPaper(shuffle(source).slice(0,mistakes?source.length:Math.min(count,source.length)));setAnswers({});setConfirmed({});setSubmitted(false);setView(mistakes?"mistakes":"quiz");window.scrollTo(0,0)};
  const startQuestion=(q:Question)=>{setPaper([q]);setAnswers({});setConfirmed({});setSubmitted(false);setView("quiz");window.scrollTo(0,0)};
  const recordResult=(q:Question,value:number[])=>{const ok=sameAnswer(q,value);if(!ok&&!mistakeIds.includes(q.id))saveMistakes([...mistakeIds,q.id]);if(view==="mistakes"&&ok)saveMistakes(mistakeIds.filter(id=>id!==q.id));};
  const choose=(q:Question,index:number)=>{if(submitted||confirmed[q.id])return;if(questionType(q)==="multiple"){setAnswers(current=>{const selected=current[q.id]||[];return {...current,[q.id]:selected.includes(index)?selected.filter(i=>i!==index):[...selected,index].sort()}});return}const value=[index];setAnswers(a=>({...a,[q.id]:value}));setConfirmed(c=>({...c,[q.id]:true}));recordResult(q,value)};
  const confirmMultiple=(q:Question)=>{const value=answers[q.id]||[];if(!value.length||confirmed[q.id])return;setConfirmed(c=>({...c,[q.id]:true}));recordResult(q,value)};
  const submit=()=>{setSubmitted(true);const next=[...mistakeIds];paper.forEach(q=>{if(!sameAnswer(q,answers[q.id])&&!next.includes(q.id))next.push(q.id)});saveMistakes(next);setView("result");window.scrollTo(0,0)};
  const score=useMemo(()=>paper.filter(q=>sameAnswer(q,answers[q.id])).length,[paper,answers]);
  const availableCount=sourceForType().length;
  const countOptions=Array.from(new Set([...([5,10,15,20,30].filter(n=>n<=availableCount)),availableCount])).sort((a,b)=>a-b);
  const categories=["全部",...Array.from(new Set(BANK.map(q=>q.category)))];
  const filtered=filter==="全部"?BANK:BANK.filter(q=>q.category===filter);

  if(!authReady)return <main className="auth-shell"><div className="auth-loading">正在载入训练档案…</div></main>;
  if(!user)return <main className="auth-shell"><section className="auth-card"><div className="auth-logo">浦</div><small>浦东社工备考训练室</small><h1>{authMode==="register"?"创建专属训练档案":"欢迎回来"}</h1><p>仅需用户名即可使用。每个用户拥有独立的错题本与训练数据。</p><div className="auth-tabs"><button className={authMode==="login"?"on":""} onClick={()=>{setAuthMode("login");setAuthError("")}}>登录</button><button className={authMode==="register"?"on":""} onClick={()=>{setAuthMode("register");setAuthError("")}}>注册</button></div><form onSubmit={event=>{event.preventDefault();authenticate()}}><label htmlFor="username">用户名</label><input id="username" autoFocus autoComplete="username" maxLength={20} value={username} onChange={event=>{setUsername(event.target.value);setAuthError("")}} placeholder="请输入用户名"/><div className="auth-error" aria-live="polite">{authError}</div><button className="primary" type="submit">{authMode==="register"?"注册并开始学习":"登录"} <span>→</span></button></form><div className="auth-note"><b>本地账号说明</b><span>系统会生成唯一专属 ID；账号和数据仅保存在当前浏览器，清除浏览器数据或更换设备后无法恢复。</span></div></section></main>;

  return <main>
    <header className="topbar"><button className="brand" onClick={()=>setView("home")}><span>浦</span><b>浦东社工备考</b></button><nav><button onClick={()=>setView("home")} className={view==="home"?"active":""}>首页</button><button onClick={()=>start(false)}>按设置练习</button><button onClick={()=>mistakeIds.length&&start(true)}>错题本 <i>{mistakeIds.length}</i></button></nav><div className="profile"><span><b>{user.name}</b><small>{user.id}</small></span><button onClick={logout}>退出</button></div></header>
    {view==="home"&&<>
      <section className="hero"><div className="eyebrow">2025—2026 · 综合能力测验</div><h1>把每一次作答，<br/>变成一次扎实的进步。</h1><p>新增单选、多选、判断与图像逻辑题。请先选择答题类型，再确定本次题量。</p><div className="paper-builder"><div className="builder-step"><label><i>1</i> 选择答题类型</label><div className="type-picks">{(["single","multiple","judge","mixed"] as const).map(type=><button key={type} className={practiceType===type?"selected":""} onClick={()=>{setPracticeType(type);const total=sourceForType(type).length;if(count>total)setCount(total>=15?15:total)}}><b>{TYPE_LABELS[type]}</b><span>{type==="single"?"含图像逻辑题":type==="multiple"?"答案可能有多项":type==="judge"?"判断正误":`混合全部 ${BANK.length} 题`}</span></button>)}</div></div><div className="builder-step"><label><i>2</i> 选择答题数量 <small>当前题型共 {availableCount} 题</small></label><div className="count-picks">{countOptions.map(n=><button key={n} className={count===n?"selected":""} onClick={()=>setCount(n)}>{n}题</button>)}</div></div><div className="hero-actions"><button className="primary" onClick={()=>start(false)}>开始{TYPE_LABELS[practiceType]} <span>→</span></button><button className="secondary" onClick={()=>mistakeIds.length&&start(true)}>回顾 {mistakeIds.length} 道错题</button></div></div><aside><strong>{BANK.length}</strong><span>道精选练习题</span><strong>{BANK.filter(q=>questionType(q)==="multiple").length}</strong><span>道多选题</span><strong>{BANK.filter(q=>q.visual).length}</strong><span>道图像逻辑题</span></aside></section>
      <section className="section"><div className="section-head"><div><small>WRITING LIBRARY</small><h2>写作范文资料库</h2><p>写作不纳入在线答题，在这里集中阅读常用结构与表达。</p></div></div><div className="articles">{ARTICLES.map((a,i)=><article key={a.title} onClick={()=>setOpenArticle(openArticle===i?null:i)}><div className="article-no">0{i+1}</div><div><span className="tag">{a.type}</span><h3>{a.title}</h3><p>{a.tips}</p></div><button aria-label="展开范文">{openArticle===i?"−":"＋"}</button>{openArticle===i&&<div className="article-body"><pre>{a.body}</pre><div><b>写作提示</b>{a.tips}</div></div>}</article>)}</div></section>
      <section className="section bank"><div className="section-head"><div><small>QUESTION BANK</small><h2>题库概览</h2><p>覆盖三个相关考试批次的单选、多选、判断与图像逻辑题，点击任意题目即可作答。</p></div><b>{filtered.length} QUESTIONS</b></div><div className="chips">{categories.map(c=><button className={filter===c?"on":""} onClick={()=>setFilter(c)} key={c}>{c}</button>)}</div><div className="sample-list">{filtered.map((q,i)=><button type="button" onClick={()=>startQuestion(q)} key={q.id}><span>{String(i+1).padStart(2,"0")}</span><div><em>{TYPE_LABELS[questionType(q)]} · {q.category} · {q.period}</em><p>{q.stem}</p></div><b>开始作答 →</b></button>)}</div></section>
    </>}
    {(view==="quiz"||view==="mistakes")&&<section className="quiz-wrap"><div className="quiz-title"><div><small>{view==="mistakes"?"MISTAKE REVIEW":"RANDOM PRACTICE"}</small><h1>{view==="mistakes"?"错题强化训练":TYPE_LABELS[practiceType]}</h1></div><div className="progress"><span>{Object.keys(confirmed).length} / {paper.length}</span><div><i style={{width:`${paper.length?Object.keys(confirmed).length/paper.length*100:0}%`}}/></div></div></div><p className="notice">单选、判断题选择后即锁定；多选题选完后点击“确认答案”。答错时立即显示正确答案，答对不显示。</p>{paper.map((q,qi)=>{const picked=answers[q.id]||[];const done=!!confirmed[q.id];const wrong=done&&!sameAnswer(q,picked);const keys=answerKey(q);return <article className="question" key={q.id}><div className="qmeta"><b>{String(qi+1).padStart(2,"0")}</b><span>{TYPE_LABELS[questionType(q)]}</span><span>{q.category}</span><em>{q.period}</em></div><h3>{q.stem}</h3>{q.visual&&<div className="logic-visual" aria-label={`图形序列：${q.visual}`}>{q.visual}</div>}<div className="options">{q.options.map((op,i)=><button key={op} disabled={done} onClick={()=>choose(q,i)} className={`${picked.includes(i)?"picked":""} ${wrong&&keys.includes(i)?"correct":""} ${wrong&&picked.includes(i)&&!keys.includes(i)?"wrong":""}`}><i>{LETTERS[i]}</i><span>{op}</span>{done&&picked.includes(i)&&<b>{keys.includes(i)?"✓":"×"}</b>}</button>)}</div>{questionType(q)==="multiple"&&!done&&<button className="confirm-answer" disabled={!picked.length} onClick={()=>confirmMultiple(q)}>确认答案（已选 {picked.length} 项）</button>}{wrong&&<div className="feedback"><b>答案：{keys.map(i=>LETTERS[i]).join("、")}</b><span>{q.explanation}</span></div>}</article>})}<div className="submitbar"><span>已完成 {Object.keys(confirmed).length} / {paper.length}</span><button className="primary" disabled={!paper.length} onClick={submit}>提交交卷</button></div></section>}
    {view==="result"&&<section className="result-wrap"><div className="score-card"><small>本次成绩</small><strong>{paper.length?Math.round(score/paper.length*100):0}<i>分</i></strong><p>答对 {score} 题 · 答错/未答 {paper.length-score} 题</p><button className="primary" onClick={()=>start(false)}>按当前设置再练一卷 →</button></div><div className="review"><div className="section-head"><div><small>ANSWER REVIEW</small><h2>答卷与解析</h2></div><span>逐题公布正确答案</span></div>{paper.map((q,i)=>{const ok=sameAnswer(q,answers[q.id]);return <article key={q.id} className={ok?"review-ok":"review-wrong"}><div className="review-mark">{ok?"✓":"×"}</div><div><em>{i+1}. {TYPE_LABELS[questionType(q)]} · {q.category}</em><h3>{q.stem}</h3>{q.visual&&<div className="logic-visual compact">{q.visual}</div>}<p>你的答案：{answerText(q,answers[q.id])}</p><p className="right-answer">正确答案：{answerText(q,answerKey(q))}</p><small>{q.explanation}</small></div></article>})}</div></section>}
    <footer><b>浦东社工备考训练室</b><p>本题库依据公开考情与相关知识整理，不是官方原卷或官方答案。</p><span>{user.name}（{user.id}）的数据仅保存在当前浏览器</span></footer>
  </main>
}
