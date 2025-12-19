#################################################################
#                        HTTP 社交辞令                           #
#    Social Protocol based on RFC 7231, WebDAV & Cloudflare     #
#################################################################

=================================================================
[1xx: Information / Hold on] - 正在处理中，请稍候
=================================================================
100 Continue            :: 不要说「我在听/请继续说/可以往下讲」，试着说「100 Continue」
                           服务器已收到请求头，客户端可以继续发送内容了
101 Switching Protocols :: 不要说「我们换个话题/转换频道吧/换个方式聊天吧」，试着说「101 Switching Protocols」
                           正在从HTTP升级到WebSocket，换个通讯方式聊天
102 Processing          :: 不要说「你的需求我收到了/别急/脑子还在转/just等我消息」，试着说「102 Processing」
                           任务已接收，正在处理，别急，还没完
103 Early Hints         :: 不要说「提前通知/剧透预警」，试着说「103 Early Hints」
                           服务器提前告诉你等会儿需要加载哪些资源，让你先准备着

=================================================================
[2xx: Success / Affirmation] - 请求成功，一切顺利
=================================================================
200 OK                  :: 不要说「明白/收到/好的」，试着说「200 OK」
                           请求成功
201 Created             :: 不要说「新建成功/新东西搞定/你说的项目建好了」，试着说「201 Created」
                           资源创建成功，例如：注册新用户、发表新文章、创建新订单
202 Accepted            :: 不要说「接受了/这活我接了」，试着说「202 Accepted」
                           任务已接受，异步处理中，例如：视频转码、报告生成
                           社交场景：你交代的事我记下了，做完了告诉你
203 Non-Authoritative   :: 不要说「我听说的/据小道消息/不是我亲眼看到的」，试着说「203 Non-Authoritative Information」
                           信息来自第三方转述，例如：通过CDN/代理获取的数据
204 No Content          :: 不要说「已读不回/收到了，但是我不用回」，试着说「204 No Content」
                           成功但无需返回内容，例如：删除成功、保存成功
205 Reset Content       :: 不要说「我们重新开始/忘了吧，重头再来」，试着说「205 Reset Content」
                           操作成功，刷新重来
206 Partial Content     :: 不要说「我话先只说一半/分卷文件」，试着说「206 Partial Content」
                           只返回请求的部分，支持断点续传、分段下载
207 Multi-Status        :: 不要说「有成有败/心情很复杂/一言难尽/五味杂陈」，试着说「207 Multi-Status」 (WebDAV)
                           批量操作有成有败
208 Already Reported    :: 不要说「这事儿我说过八百遍了」，试着说「208 Already Reported」 (WebDAV)
                           该资源在响应中已经出现过，避免重复
226 IM Used             :: 不要说「我已按照你说的处理过了/你要的资料已按你说的格式整理好」，试着说「226 IM Used」
                           服务器已对资源应用了实例操作（Instance Manipulation），返回的是变换后的结果

=================================================================
[3xx: Redirection / Evasion] - 重定向，换个地方找
=================================================================
300 Multiple Choices    :: 不要说「选择困难症/不知道选哪个/好多选项你来选」，试着说「300 Multiple Choices」
                           有多个选项可用，你自己挑一个吧
301 Moved Permanently   :: 不要说「永久搬家/彻底搬走了/我换工作了」，试着说「301 Moved Permanently」
                           资源已永久迁移，请更新你的书签
302 Found               :: 不要说「临时在别处马上回来/去个厕所马上回」，试着说「302 Found」
                           资源临时在另一个位置，但还会回来
303 See Other           :: 不要说「找别人吧/这个问题问张三，他比我懂」，试着说「303 See Other」
                           响应在另一个URI，用GET去取
304 Not Modified        :: 不要说「没变化/老样子/还是那个配方」，试着说「304 Not Modified」
                           资源未修改，用你的缓存就好
305 Use Proxy           :: 不要说「通过中间人/代理找他」，试着说「305 Use Proxy」
                           必须通过代理访问这个资源
307 Temporary Redirect  :: 不要说「我临时住这新地方，用原来方式联系我」，试着说「307 Temporary Redirect」
                           临时重定向，保持原请求方法
308 Permanent Redirect  :: 不要说「我永久在这，来这找我吧」，试着说「308 Permanent Redirect」
                           永久重定向，保持原请求方法

=================================================================
[4xx: Client Error / Rejection] - 客户端错误，请检查你的请求
=================================================================
400 Bad Request         :: 不要说「你说的我听不懂/你在说啥/叽里咕噜说啥呢」，试着说「400 Bad Request」
                           请求格式错误，服务器看不懂
401 Unauthorized        :: 不要说「没权限/你是谁？」，试着说「401 Unauthorized」
                           需要身份验证，请先登录
402 Payment Required    :: 不要说「v我50/得加钱/这是付费内容」，试着说「402 Payment Required」
                           需要付费才能访问，掏钱吧
403 Forbidden           :: 不要说「拒绝/禁止入内」，试着说「403 Forbidden」
                           服务器拒绝请求，你没有访问权限
404 Not Found           :: 不要说「找不到/查无此人/没这事啊」，试着说「404 Not Found」
                           请求的资源不存在，可能地址写错了
405 Method Not Allowed  :: 不要说「方法不对/这样不行/错误的打开方式」，试着说「405 Method Not Allowed」
                           请求方法不允许，比如只支持GET却用了POST
406 Not Acceptable      :: 不要说「不符合要求/不接受」，试着说「406 Not Acceptable」
                           服务器无法提供符合Accept头的内容
407 Proxy Auth Required :: 不要说「代理要验证/叫你老板来」，试着说「407 Proxy Authentication Required」
                           需要通过代理进行身份验证
408 Request Timeout     :: 不要说「你太慢了/超时了/我先走了」，试着说「408 Request Timeout」
                           请求超时，服务器等不及了
409 Conflict            :: 不要说「撞车了/冲突了/别人正在编辑导致冲突」，试着说「409 Conflict」
                           请求与当前状态冲突，比如并发编辑冲突
410 Gone                :: 不要说「没了/永久消失/不见了」，试着说「410 Gone」
                           资源已被永久删除，不再提供
411 Length Required     :: 不要说「缺少长度信息/你没说你要多少/告诉我你要多少」，试着说「411 Length Required」
                           请求头必须包含Content-Length
412 Precondition Failed :: 不要说「条件不满足/前置条件失败导致事情办不了」，试着说「412 Precondition Failed」
                           请求头中的条件评估为false
413 Payload Too Large   :: 不要说「请求体太大了/内容太多无法接受」，试着说「413 Payload Too Large」
                           请求实体超过服务器限制
414 URI Too Long        :: 不要说「太长不看/网址太长打不开」，试着说「414 URI Too Long」
                           URI超过服务器处理长度
415 Unsupported Media   :: 不要说「格式不对/不支持这种格式」，试着说「415 Unsupported Media Type」
                           请求的媒体类型服务器不支持
416 Range Not Satisfiable:: 不要说「范围超出/无法满足」，试着说「416 Range Not Satisfiable」
                           Range请求的范围无效或超出范围
417 Expectation Failed  :: 不要说「期望落空/想多了/你期望的事我做不到」，试着说「417 Expectation Failed」
                           服务器无法满足Expect请求头的要求
418 I'm a teapot        :: 不要说「我是茶壶/愚人节彩蛋」，试着说「418 I'm a teapot」
                           我是茶壶，不能煮咖啡（RFC 2324愚人节笑话）
419 Page Expired        :: 不要说「页面过期了/表单过期」，试着说「419 Page Expired」 (Laravel)
                           【CSRF令牌过期】表单提交时安全令牌已过期
                           社交场景：这张票过期了，刷新重新领一张
420 Enhance Your Calm   :: 不要说「冷静点/别急/消停会儿」，试着说「420 Enhance Your Calm」 (Twitter)
                           【请求频率过高】你发请求太快了，触发了频率限制
                           社交场景：你发消息太快了，歇会儿再说
421 Misdirected Request :: 不要说「找错人了/发错地方」，试着说「421 Misdirected Request」
                           【请求发错服务器】请求被发到了不该处理它的服务器
                           社交场景：你这事儿找错部门了，我管不了
422 Unprocessable Entity:: 不要说「格式对但内容有问题/逻辑错误」，试着说「422 Unprocessable Entity」
                           【语义错误】请求格式正确，但内容有逻辑问题
                           社交场景：申请表填对了，但你的理由说不通
423 Locked              :: 不要说「被锁了/正在使用中」，试着说「423 Locked」 (WebDAV)
                           【资源被锁定】资源正被其他用户锁定，无法访问
                           社交场景：这个文件别人正在编辑，等他用完
424 Failed Dependency   :: 不要说「因为前面失败了，所以这个也不行」，试着说「424 Failed Dependency」
                           【依赖操作失败】因为依赖的前置操作失败了
                           社交场景：前一个任务没完成，这个也做不了
425 Too Early           :: 不要说「太早了/还没到时候」，试着说「425 Too Early」
                           【请求过早】服务器不愿意处理可能被重放的早期请求
                           社交场景：活动还没开始，别急着抢
426 Upgrade Required    :: 不要说「版本太旧/需要升级」，试着说「426 Upgrade Required」
                           【需要协议升级】客户端需要升级到新协议版本
                           社交场景：你的APP版本太旧，先升级才能用
428 Precondition Req    :: 不要说「缺前置条件/先把条件说清楚」，试着说「428 Precondition Required」
                           【缺少前置条件】服务器要求请求必须包含条件头
                           社交场景：你得先声明你同意条款，才能继续
429 Too Many Requests   :: 不要说「别刷屏/发太快了」，试着说「429 Too Many Requests」
                           【超过速率限制】短时间内请求次数过多
                           社交场景：你操作太频繁，先冷静一下
431 Header Fields Large :: 不要说「请求头太大/废话太多」，试着说「431 Request Header Fields Too Large」
                           【请求头过大】请求头字段总大小超过服务器限制
                           社交场景：你提供的附加信息太多了，简洁点
444 No Response         :: 不要说「不想说话/直接挂断」，试着说「444 No Response」 (Nginx)
                           【无响应断开】服务器不返回任何信息并直接关闭连接
                           社交场景：懒得理你，直接挂电话
450 Blocked by Windows  :: 不要说「被家长控制了/被限制了」，试着说「450 Blocked by Windows Parental Controls」
                           【家长控制阻止】被Windows家长控制功能拦截
                           社交场景：你妈不让你看这个网站
451 Legal Reasons       :: 不要说「因法律原因不可用/被和谐了」，试着说「451 Unavailable For Legal Reasons」
                           【法律原因不可用】因法律法规要求无法提供该内容
                           社交场景：因为相关规定，这个内容不能给你看
497 HTTP to HTTPS       :: 不要说「协议不对/走错门了」，试着说「497 HTTP Request Sent to HTTPS Port」 (Nginx)
                           【协议端口不匹配】向HTTPS端口发送了HTTP请求
                           社交场景：这是加密通道，你用明文说话我听不懂
498 Invalid Token       :: 不要说「令牌无效/密码错了/凭证过期」，试着说「498 Invalid Token」 (Esri)
                           【令牌无效】提供的身份令牌无效或已过期
                           社交场景：你的通行证失效了，重新登录
499 Client Closed Req   :: 不要说「对方挂了/不等了/走了」，试着说「499 Client Closed Request」 (Nginx)
                           【客户端提前关闭】客户端在服务器响应前就关闭了连接
                           社交场景：你问题还没说完就挂电话了

=================================================================
[5xx: Server Error / My Fault] - 服务器错误，这是我的问题
=================================================================
500 Internal Error      :: 不要说「崩溃了/心态炸了/我出问题了」，试着说「500 Internal Server Error」
                           【服务器内部错误】服务器遇到意外情况，无法完成请求
                           社交场景：不好意思，我这边出了点问题（不是你的错）
501 Not Implemented     :: 不要说「这个真不会/超纲了/没这功能」，试着说「501 Not Implemented」
                           【功能未实现】服务器不支持完成请求所需的功能
                           社交场景：这个功能我们还没开发，暂时做不了
502 Bad Gateway         :: 不要说「上游出问题了/不是我的锅」，试着说「502 Bad Gateway」
                           【网关错误】网关从上游服务器收到无效响应
                           社交场景：我问了上级，但他给了我错误的答复
503 Service Unavailable :: 不要说「摸鱼中/维护中/忙不过来」，试着说「503 Service Unavailable」
                           【服务不可用】服务器暂时无法处理请求，通常是维护或过载
                           社交场景：系统维护中/服务器太忙了，稍后再试
504 Gateway Timeout     :: 不要说「上游没响应/猪队友超时」，试着说「504 Gateway Timeout」
                           【网关超时】网关等待上游服务器响应超时
                           社交场景：我问了上级，但他一直没回我
505 HTTP Version Not Sup:: 不要说「版本不支持/太老了/有代沟」，试着说「505 HTTP Version Not Supported」
                           【HTTP版本不支持】服务器不支持请求使用的HTTP协议版本
                           社交场景：你说的话太古老了，我听不懂这种方言
506 Variant Also Neg    :: 不要说「内部配置错误/自己打架」，试着说「506 Variant Also Negotiates」
                           【协商循环引用】服务器内部配置错误，导致内容协商循环
                           社交场景：我们内部规则冲突了，自己跟自己绕晕了
507 Insufficient Storage:: 不要说「存储空间不足/硬盘满了/装不下」，试着说「507 Insufficient Storage」
                           【存储空间不足】服务器无法存储完成请求所需的内容
                           社交场景：我这里空间不够了，存不下你的东西
508 Loop Detected       :: 不要说「死循环/鬼打墙/绕圈了」，试着说「508 Loop Detected」
                           【检测到循环】服务器在处理请求时检测到无限循环
                           社交场景：你的需求会让我陷入死循环，做不了
509 Bandwidth Exceeded  :: 不要说「流量超了/带宽用完/月光了」，试着说「509 Bandwidth Limit Exceeded」
                           【带宽超限】服务器的带宽配额已用完
                           社交场景：这个月流量用完了，下月再说
510 Not Extended        :: 不要说「需要更多扩展/功能不够」，试着说「510 Not Extended」
                           【未扩展】服务器需要对请求进行进一步扩展才能完成
                           社交场景：你的需求超出了我的能力范围，需要额外支持
511 Network Auth Req    :: 不要说「需要网络认证/先连上网」，试着说「511 Network Authentication Required」
                           【需要网络认证】需要通过网络身份验证才能访问
                           社交场景：你得先连上公司WiFi才能访问这个
520 Unknown Error       :: 不要说「莫名其妙的错误/不知道哪里出错了」，试着说「520 Web Server Returned an Unknown Error」
                           【未知错误】源服务器返回了未知或不可识别的错误
                           社交场景：出了个奇怪的问题，我也不知道怎么回事
521 Web Server Is Down  :: 不要说「服务器挂了/彻底躺平/罢工了」，试着说「521 Web Server Is Down」 (Cloudflare)
                           【源服务器宕机】源服务器拒绝Cloudflare的连接
                           社交场景：服务器已经完全挂了，起不来了
522 Connection Timed Out:: 不要说「连接超时/失联了/联系不上」，试着说「522 Connection Timed Out」 (Cloudflare)
                           【连接超时】Cloudflare无法与源服务器建立TCP连接
                           社交场景：打了半天电话都打不通，连不上
523 Origin Unreachable  :: 不要说「源站不可达/找不到路/到不了」，试着说「523 Origin Is Unreachable」 (Cloudflare)
                           【源站不可达】Cloudflare无法到达源服务器，通常是路由问题
                           社交场景：对方的地址找不到，路不通
530 Origin DNS Error    :: 不要说「DNS解析失败/找不到地址/门牌号错了」，试着说「530 Origin DNS Error」 (Cloudflare)
                           【DNS解析错误】Cloudflare无法解析源服务器的域名
                           社交场景：这个地址查不到，可能写错了