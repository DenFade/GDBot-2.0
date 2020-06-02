importClass(org.jsoup.Jsoup);

const scriptName = "GDBot_ver2.js";

//prepare!

Api.prepare("GD_Indexes.js");
Api.prepare("util_package.js");
Api.prepare("Tools.js");
Api.prepare("TopSecretXDDD.js");
Api.prepare("ScriptData.js");
Api.prepare("Font_Generator.js");
Api.prepare("DFCipher.js"); 
Api.prepare("GDRequest.js");
Api.prepare("GDBeautifier.js");

const Looper = Bridge.getScopeOf("Looper.js");
const Client = Bridge.getScopeOf("GDRequest.js");
const Tools = Bridge.getScopeOf("Tools.js");
const Util = Bridge.getScopeOf("util_package.js");
const Display = Bridge.getScopeOf("GDBeautifier.js");
const Font = Bridge.getScopeOf("Font_Generator.js");
const Cipher = Bridge.getScopeOf("DFCipher.js");
const RobTopsSecretStuffAdapter = Bridge.getScopeOf("TopSecretXDDD.js");
const Indexes = Bridge.getScopeOf("GD_Indexes.js");
const ScriptData = Bridge.getScopeOf("ScriptData.js");
 
const prefix = "!";
const seperator = " ";
const ignoreSeperator = "_";
const all = "\u200b".repeat(500);
const line_L = "---------------------------------------------------------------------------------";
const line_S = "-------------------------------------------------";

const GDBOT_KEY = "Um9zZXMgYXJlIHJlZA=="; //?
 
const COMMON_CMD = 0;
const AUTHICATED_CMD = 1;
const CIRCULATING_CMD = 2;
 
const DEVELOPER_ONLY = 11;
const MODERATOR_ALSO = 12;
 
const BOT_OFF = 21;
const ADD_IGNORING_RATE = 22;

const Bot = {
    isOn: true, //script is on or not
    blacklist: [], //blocked user
    admin: "De\u200bnF\u200bad\u200be", //admin (you must use your own identifiable nickname)
    moderator: [], //moderators..(like staff),
    captcha: -2
};

var schedule = [];
var ERROR_ID = 100;
var started = new Date().getTime();

//Static_Field

const GDQuest = {
    id: null,
    currentRequest: [],
    currentQuest: {
        allow: ["Geometry dash Community room", "Geometry Dash Bot Channel", "(GMD) Sweetdream Chatroom", "Geometry Dash fhewi chatroom"],
        
    },
    advertise: []
};

const GDAdvertisement = {
    id: null,
    setup: {
        allow: ["Geometry dash Community room", "Geometry Dash Bot Channel", "(GMD) Sweetdream Chatroom", "Geometry Dash fhewi chatroom"],
        cancel: function(){
            this.id == null ? false : Looper.clearInterval(this.id);
        }
    }
}

const Field = {
    register: function(room, sender, data){
        Field[room+"&"+sender] = data;
    },
    read: function(room, sender){
        return Field[room+"&"+sender];
    },
    delete: function(room, sender){
        delete Field[room+"&"+sender];
    }
};

//Functions

String.prototype.format = function(){
    return this.replace(/\{\$(\d)\}/gi, (a,b) => Array.from(arguments)[b-1]);
}

Array.prototype.outOfIndexHandler = function(pre, change){
    return this.indexOf(pre) == -1 ? change : pre;
}

Array.in = function(arr, ele){
    return arr.indexOf(ele) != -1 ? true : false
}

Object.json3 = function(obj){
    return JSON.stringify(obj,null,3);
}

Object.json4 = function(obj){
    return JSON.stringify(obj,null,4);
}

//Object.convertProfile = function(obj){
    

function getPlayer(id){
    return JSON.parse(FileStream.read(PLAYER_ROUTE+id+".json"));
}

function savePlayer(id, data){
    FileStream.write(PLAYER_ROUTE+id+".json", Object.json4(data));
    return "Saved Successfully";
}

function editPlayer(id, key, value){
    let data = getPlayer(id);
    data[key] = value;
    savePlayer(id, data);
    return key+" changed";
}

function initPlayer(room, sender, id){
    let list = getDataBase();
    list = JSON.parse(list);
    list.push({
        room: room,
        sender: sender,
        id: id
    });
    FileStream.write(PLAYER_ROUTE + "DATABASE.json", Object.json4(list));
    return "init";
}

function findPlayer(room, sender){
    let list, player;
    list = getDataBase();

    list = JSON.parse(list);
    player = list.find(v => v.room == room && v.sender == sender);
    return !player ? -1 : player.id;
}

function levelize(player, amount){
    player.exp += amount
    while(player.exp > player.need){
        player.exp -= player.need;
        player.need = (player.need * Math.sqrt(Math.E)) | 0
        player.level++;
    }
    return player;
}

function getDataBase(){
    return FileStream.read(PLAYER_ROUTE + "DATABASE.json");
}

function saveDataBase(db){
    FileStream.write(PLAYER_ROUTE + "DATABASE.json", Object.json4(db));
}

function nullDataHandler(pre, change){
    return !pre ? change : pre;
}

function absolute_cmd(){
    return Object.keys(Command).slice(3);
}

const PrefixAttach = {
    s: function (data){
        return "[⚡] " + data;
    },
    e: function (data){
        return "[❌] " + data;
    },
    u: function (data){
        return "[?] " + data;
    },
    i: function (data){
        return "[📣] " + data;
    }
};

function commentBuilder(){
    return Array.from(arguments).join("");
}

//FileRoutes

const PLAYER_ROUTE = "/sdcard/GDBot/users/";
const LEVEL_ROUTE = "/sdcard/GDBot/levels/";
const FORUM_ROUTE = "/sdcard/GDBot/demonlist/";
const PROFILE_DATA_ROUTE = "/sdcard/GDBot/profiles/";    //@Deprecated
const Q_SETUP_ROUTE = "/sdcard/GDBot/quest/setup.json;"
const AD_SETUP_ROUTE = "/sdcard/GDBot/advertisement/setup.json";

//Classes

function Profile(gd_profile, clear, tower, exp, level, need, records, recommends){
    this.gd_profile = gd_profile;
    this.clear = nullDataHandler(clear, []);
    this.tower = nullDataHandler(tower, 0);
    this.exp = nullDataHandler(exp, 0);
    this.level = nullDataHandler(level, 0);
    this.need = nullDataHandler(need, 1000);
    this.records = nullDataHandler(records, []);
    this.recommends = nullDataHandler(recommends, []);
}

function GDClient(bs, data, security){
	
    /* (String) bs: apply BasicSet */
    this.bs = bs;
    /* (Object) add data based on BasicSet */
    this.data = data;
    /* (String) security: add permission */
    this.security = security;
	
}

GDClient.prototype.authicated = function(){

    /* Bot Account */

    this.data.accountID = 12109603;
    this.data.gjp = ""; //holy shit
    return this;
}



const Command = {
    getType: function(cmd){
        return this[cmd].type;
    },
    do_this: function(cmd, context, callback){
        let result;
        if(cmd.includes(":")){
            let prod = cmd.split(":")[0];
            let req = cmd.split(":")[1];
            try{
                result = Command[prod].cycles[req].run(context);
            } catch(e){
                Log.i("ERROR CODE: "+(ERROR_ID++)+"\n\n"+e.lineNumber+"번줄: "+e.toString()+"\n\n"+e.stack);
                callback(undefined, PrefixAttach.e("오류가 발생했어요.."), undefined);
                return;
            }
            callback(result.s, result.e, result.kill);
            return;
        }
        try{
            result = Command[cmd].run(context);
        } catch(e){
            Log.i("ERROR CODE: "+(ERROR_ID++)+"\n\n"+e.lineNumber+"번줄: "+e.toString()+"\n\n"+e.stack);
            callback(undefined, PrefixAttach.e("오류가 발생했어요.."), Command[cmd].type == CIRCULATING_CMD);
            return;
        }
        callback(result.s, result.e, Command[cmd].type == CIRCULATING_CMD ? result.kill : result.p);
        return;
    },
    isExist: function(cmd){
        return Object.keys(Command).indexOf(cmd) != -1;
    },
    help: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 3000,
        run: function (context){
            return {s: PrefixAttach.s("도움말 링크입니다.\nhttps://github.com/DenFade/GDBot-2.0\nStar 한번씩만 눌러주세요 :)")}
        }
    },
    search: {
        isOn: true,
        type: CIRCULATING_CMD,
        cooldown: 3000,
        next: ["open", "next", "pre", "page"],
        run: function (context){
            let client, req, result, creatorList, page;
            page = (!context.args[2] ? 0 : Number(context.args[2]))
            if(context.args[0] == "level"){
                if(context.args[2] && !Util.moreSafeNumber(context.args[2])) return {e: PrefixAttach.e("페이지는 반드시 0이상 정수로 입력하세요."), kill: true };
                //args[1] as level name

                client = new GDClient("map", {str: context.args[1], //page: args[2]
                                                stragegy: context.args[3],
                                                len: context.args[4],
                                                diff: context.args[5],
                                                uncompleted: context.args[6],
                                                onlyCompleted: context.args[7],
                                                featured: context.args[8],
                                                original: context.args[9],
                                                twoPlayer: context.args[10],
                                                coins: context.args[11],
                                                epic: context.args[12],
                                                star: context.args[13],
                                                page: page
                                                
                });
                req = Client.searchGDMap(client);
                if(req == null){
                    return {e: PrefixAttach.e("검색 결과가 없습니다."), kill: true };
                } else {
                    result = req.levels.map(v => Display.GDMapShortify(v, req.creators[v[6]] || "???"));
                    req.page = req.page.map(v => Number(v));
                    
                    //Field에 정보 등록
                    Field.register(context.room, context.sender, {
                        list: req.levels.map(v => v[Indexes.LEVEL_ID]),
                        client: client,
                        data_type: "level",
                        page: Number(page)
                    });
                    
                    return {s: commentBuilder("🛠 레벨을 검색해봤어요~ 🛠", all, "\n"+' '.repeat(30) + "- Page " + page + " (" + (req.page[1]+1) + "/" + (req.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                }
            } else if(context.args[0].includes("user")){
                //args[1] as user name

                if(!context.args[1]) return {e: PrefixAttach.e("유저네임을 입력하세요."), kill: true };
                client = new GDClient("user", {str: context.args[1], page: context.args[2]});
                req = Client.searchGDUser(client);
                if(req == null){
                    return {e: PrefixAttach.e("검색 결과가 없습니다."), kill: true };
                } else {
                    if(context.args[0] == "user"){
                        result = req.users.map(v => Display.GDUserShortify(v));

                        //Field에 정보 등록
                        Field.register(context.room, context.sender, {
                            list: req.users.map(v => v[Indexes.PROFILE_ACCOUNT_ID]),
                            client: client,
                            data_type: "user",
                            page: Number(page)
                        });

                        return {s: commentBuilder("🤖 유저를 검색해봤어요~ 🤖\n-> ", all, "\n"+' '.repeat(30) + "- Page " + context.args[2] + " (" + (req.page[1]+1) + "/" + (req.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L)};
                    } else if(context.args[0] == "user-level"){
                        let levels, pid = req.users[0][Indexes.PROFILE_PLAYER_ID];
                        levels = Client.searchGDMap(new GDClient("map", { str: pid, strategy: 5, page: 0 }));
                        result = levels.levels.map(v => Display.GDMapShortify(v, req.users[0][Indexes.PROFILE_NAME] || "???"));
                        levels.page = levels.page.map(v => Number(v));
                    
                        //Field에 정보 등록
                        Field.register(context.room, context.sender, {
                            list: levels.levels.map(v => v[Indexes.LEVEL_ID]),
                            client: new GDClient("map", { str: pid, strategy: 5, page: 0 }),
                            data_type: "level", //굳이 user-level 안해도 될거같아서 안함
                            page: 0
                        });
                    
                        return {s: commentBuilder("🛠 레벨을 검색해봤어요~ 🛠", all, "\n"+' '.repeat(30) + "- Page " + page + " (" + (req.page[1]+1) + "/" + (req.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    } else {
                        return {e: PrefixAttach.e("검색 태그를 입력해주세요\n -> \"level\", \"user\", \"user-level\""), kill: true };
                    }
                }
            } else if(context.args[0] == "user-level"){
                //args[1] as user name
                return {e: PrefixAttach.u("개발중인 기능입니다."), kill: true };
            } else {
                return {e: PrefixAttach.e("검색 태그를 입력해주세요\n -> \"level\", \"user\", \"user-level\""), kill: true };
            }
        },
        cycles: {
            open: {
                type: COMMON_CMD,
                next: ["open", "next", "pre", "page"],
                run: function (context){
                    if(!context.args[0] || !Util.moreSafeNumber(context.args[0]) || Number(context.args[0]) < 1) return {e: PrefixAttach.e("1~10 사이 정수를 입력해주세요.") };
                    let field_data;
                    field_data = Field.read(context.room, context.sender);

                    if(field_data.data_type == "level"){
                        let level_id, level_client, optional_client, level_data, optional_data, creatorList, result;
                        level_id = field_data.list[Number(context.args[0])-1];
                        if(!level_id) return {e: PrefixAttach.e("없는 레벨입니다.") };

                        Api.replyRoom(context.room, PrefixAttach.i("잠시만 기다려주세요!"));
                        level_client = new GDClient("map", {levelID: level_id});
                        optional_client = new GDClient("map", {str: level_id});
                        level_data = Client.findGDMap(level_client);
                        optional_data = Client.findSingleGDMap(optional_client);
                        result = Display.GDMapBeautify(level_data, optional_data.creator, optional_data.song);
                        //Field 정보 쓰던거 다시쓰면됨

                        return {s: result};
                        
                    } else if(field_data.data_type == "user"){
                        if(!context.args[0] || !Util.moreSafeNumber(context.args[0])) return {e: PrefixAttach.e("1~10 사이 정수를 입력해주세요.") };
                        let user_id, profile_client, profile_data, result;
                        user_id = field_data.list[Number(context.args[0])-1];
                        if(!user_id) return {e: PrefixAttach.e("없는 유저입니다.") };

                        profile_client = new GDClient("user", {targetAccountID: user_id});
                        profile_data = Client.findGDUser(profile_client);
                        result = Display.GDUserBeautify(profile_data)
                        return {s: commentBuilder("🤖 프로필을 검색해봤어요~ 🤖\n-> ", all, "\n\n", result) };
                    }
                }
            },
            next: {
                type: COMMON_CMD,
                next: ["open", "next", "pre", "page"],
                run: function(context){
                    let field_data;
                    field_data = Field.read(context.room, context.sender);
                    field_data.client.data.page += 1;
                    let abstract_data, result;

                    switch(field_data.data_type){
                        case "level":
                            let creatorList;
                            abstract_data = Client.searchGDMap(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.levels.map((v, i) => Display.GDMapShortify(v, abstract_data.creators[v[6]] || "???"));
                            field_data.list = abstract_data.levels.map(v => v[Indexes.LEVEL_ID]);
                            break;
                        
                        case "user":
                            abstract_data = Client.searchGDUser(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.users.map(v => Display.GDUserShortify(v));
                            field_data.list = abstract_data.users.map(v => v[Indexes.PROFILE_ACCOUNT_ID]);
                            break;

                        default:
                            return {e: PrefixAttach.e("???: Something Wrong"), kill: true };
                    }
                    abstract_data.page = abstract_data.page.map(v => Number(v));
                    
                    //Field 정보 바꾼걸로 재등록
                    Field.register(context.room, context.sender, field_data);

                    if(field_data.data_type == "level"){
                        return {s: commentBuilder("🛠 레벨을 검색해봤어요~ 🛠", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    } else if(field_data.data_type == "user"){
                        return {s: commentBuilder("🤖 유저를 검색해봤어요~ 🤖", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    }
                }
            },
            pre: {
                type: COMMON_CMD,
                next: ["open", "next", "pre", "page"],
                run: function(context){
                    let field_data;
                    field_data = Field.read(context.room, context.sender);
                    if(field_data.client.data.page == 0){
                        return {e: PrefixAttach.e("첫페이지 보다 앞으로 넘길 수 없습니다.") };
                    }
                    field_data.client.data.page -= 1;
                    let abstract_data, result;

                    switch(field_data.data_type){
                        case "level":
                            let creatorList;
                            abstract_data = Client.searchGDMap(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.levels.map((v, i) => Display.GDMapShortify(v, abstract_data.creators[v[6]] || "???"));
                            field_data.list = abstract_data.levels.map(v => v[Indexes.LEVEL_ID]);
                            break;
                        
                        case "user":
                            abstract_data = Client.searchGDUser(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.users.map(v => Display.GDUserShortify(v));
                            field_data.list = abstract_data.users.map(v => v[Indexes.PROFILE_ACCOUNT_ID]);
                            break;

                        default:
                            return {e: PrefixAttach.e("???: Something Wrong"), kill: true };
                    }
                    abstract_data.page = abstract_data.page.map(v => Number(v));

                    //Field 정보 바꾼걸로 재등록
                    Field.register(context.room, context.sender, field_data);

                    if(field_data.data_type == "level"){
                        return {s: commentBuilder("🛠 레벨을 검색해봤어요~ 🛠", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    } else if(field_data.data_type == "user"){
                        return {s: commentBuilder("🤖 유저를 검색해봤어요~ 🤖", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    }
                }
            },
            page: {
                type: COMMON_CMD,
                next: ["open", "next", "pre", "page"],
                run: function(context){
                    let field_data;
                    field_data = Field.read(context.room, context.sender);
                    if(!Util.moreSafeNumber(context.args[0]) || Number(context.args[0] < 0)){
                        return {e: PrefixAttach("0 ~ ? 사이 정수를 입력해주세요.") };
                    }
                    field_data.client.data.page = Number(context.args[0]);
                    let abstract_data, result;

                    switch(field_data.data_type){
                        case "level":
                            let creatorList;
                            abstract_data = Client.searchGDMap(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.levels.map((v, i) => Display.GDMapShortify(v, abstract_data.creators[v[6]] || "???"));
                            field_data.list = abstract_data.levels.map(v => v[Indexes.LEVEL_ID]);
                            break;
                        
                        case "user":
                            abstract_data = Client.searchGDUser(field_data.client);
                            if(abstract_data == null) return {e: PrefixAttach.e("검색 결과가 없습니다.") };
                            result = abstract_data.users.map(v => Display.GDUserShortify(v));
                            field_data.list = abstract_data.users.map(v => v[Indexes.PROFILE_ACCOUNT_ID]);
                            break;

                        default:
                            return {e: PrefixAttach.e("???: Something Wrong"), kill: true };
                    }
                    abstract_data.page = abstract_data.page.map(v => Number(v)); Api.showToast(abstract_data.page)
                    
                    //Field 정보 바꾼걸로 재등록
                    Field.register(context.room, context.sender, field_data);

                    if(field_data.data_type == "level"){
                        return {s: commentBuilder("🛠 레벨을 검색해봤어요~ 🛠", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    } else if(field_data.data_type == "user"){
                        return {s: commentBuilder("🤖 유저를 검색해봤어요~ 🤖", all, "\n"+' '.repeat(30) + "- Page " + field_data.client.data.page + " (" + (abstract_data.page[1]+1) + "/" + (abstract_data.page[0] || "???") + ") -" + "\n\n", line_L + "\n", result.join("\n"+line_L+"\n"), "\n"+line_L) };
                    }
                }
            }
        }
    },
    daily: {
        isOn: true,
        type: COMMON_CMD, 
        cooldown: 10000,
        run: function(context){
            let result, name, client = new GDClient("map", {levelID: -1});
            result = Client.findGDMap(client);
            name = Client.findSingleGDMap(new GDClient("map", {str: result[Indexes.LEVEL_ID]})).creator;
            
            return {s: "🗓 오늘의 데일리 레벨입니다~ 🗓\n" +line_S + "\n" + Display.GDMapShortify(result, name) };
        }
    },
    weekly: {
        isOn: true,
        type: COMMON_CMD, 
        cooldown: 10000,
        run: function(context){
            let result, name, client = new GDClient("map", {levelID: -2});
            result = Client.findGDMap(client);
            name = Client.findSingleGDMap(new GDClient("map", {str: result[Indexes.LEVEL_ID]})).creator;
            
            return {s: "📆 이번주 위클리 레벨입니다~ 📆\n" +line_S + "\n" + Display.GDMapShortify(result, name) };
        }
    },
    register: {
        isOn: true,
        type: CIRCULATING_CMD,
        cooldown: 0,
        next: ["id"],
        run: function(context){
            return {s: PrefixAttach.s("ACCOUNT ID를 입력해주세요.\n\nEx) !id 1234567")}
        },
        cycles: {
            id:{
                type: COMMON_CMD,
                next: ["code", "retry"],
                run: function(context){
                    if(!context.args[0]){
                        return {e: PrefixAttach.e("ACCOUNT ID를 입력해주세요.") };
                    } else if(Util.fList(PLAYER_ROUTE).indexOf(context.args[0] + ".json") != -1){
                        return {e: PrefixAttach.e("이미 가입된 유저입니다.\n만약 계정 연동을 원하시면 !account"), kill: true };
                    } else {
                        let private_code, msg_client, sending_status;
                        private_code = Cipher.encrypt(context.args[0]);
                        msg_client = new GDClient("msg", {toAccountID: context.args[0], subject: "CHECK YOUR PRIVATE CODE!", body: "CODE: " + private_code}, GDBOT_KEY).authicated();
                        sending_status = Client.sendPrivateMessage(msg_client);

                        Field.register(context.room, context.sender, {acc_id: context.args[0], client: msg_client, code: private_code});

                        if(sending_status == 404){
                            return {e: PrefixAttach.e("코드 전송에 실패했습니다.\n\n1. 유효한 계정의 ACCOUNT ID가 아닙니다.\n2. 메시지 허용 범위가 전체허용 상태가 아닙니다.\n\n:: !retry 명령어를 통해 코드를 재발급 받을 수 있습니다.") };
                        } else {
                            return {s: PrefixAttach.s("당신의 GD계정으로 코드를 전송했습니다.\n\nEx) !code 73920593250352") };
                        }
                    }
                }   
            }, 
            retry: {
                type: COMMON_CMD,
                next: ["code", "retry"],
                run: function(context){
                    let field_data, sending_status;
                    field_data = Field.read(context.room, context.sender);
                    sending_status = Client.sendPrivateMessage(field_data.client);
                    if(sending_status == 404){
                        return {e: PrefixAttach.e("코드 전송에 실패했습니다.\n\n1. 유효한 계정의 ACCOUNT ID가 아닙니다.\n2. 메시지 허용 범위가 전체허용 상태가 아닙니다.\n\n:: !retry 명령어를 통해 코드를 재발급 받을 수 있습니다.") };
                    } else {
                        return {s: PrefixAttach.s("당신의 GD계정으로 코드를 전송했습니다.\n\nEx) !code 73920593250352") };
                    }
                }
            },
            code: {
                type: COMMON_CMD,
                next: [],
                run: function(context){
                    if(!context.args[0]){
                        return {e: PrefixAttach.e("CODE를 입력해주세요.") };
                    } else {
                        let field_data = Field.read(context.room, context.sender);

                        if(field_data.code != context.args[0]){
                            return {e: PrefixAttach.e("일치하지 않는 코드입니다.") };
                        } else {
                            let profile_client, profile_data, gdbot_profile;
                            profile_client = new GDClient("user", {targetAccountID: field_data.acc_id});
                            profile_data = Client.findGDUser(profile_client);

                            gdbot_profile = new Profile(profile_data);
                            initPlayer(context.room, context.sender, field_data.acc_id);
                            savePlayer(field_data.acc_id, gdbot_profile);

                            return {s: PrefixAttach.s("등록을 완료했습니다.\n\n:: !profile을 통해 자신의 정보를 확인하세요."), kill: true };
                        }
                    }
                }
            }
        }
    },
    jukebox: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 8000,
        run: function (context){
            let juke_client, song_id, credit_client, credit_data, status;
            juke_client = new GDClient("ng");
            song_id = Client.randomSong(juke_client);
            
            credit_client = new GDClient("song", { songID: song_id });
            credit_data = Client.songInfo(credit_client);

            return { s: "🎧 랜덤으로 뽑은 노래입니다~ 🎧\n"+line_S+"\n"+Display.GDSongShortify(credit_data)+"\n"+line_S };
        }
    },
    bgm: {
        isOn: true,
        type: CIRCULATING_CMD,
        cooldown: 5000,
        next: [],
        run: function(context){

        },
        cycles: {

        }
    },
    ranking: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 10000,
        run: function (context){
            if(!context.args[0]) return {e: PrefixAttach.e("태그를 입력해주세요.") };
            let initials = {
                star: {
                    idx: Indexes.PROFILE_STARS,
                    icon: "🌟"
                },
                demon: {
                    idx: Indexes.PROFILE_DEMONS,
                    icon: "👿"
                },
                diamond: {
                    idx: Indexes.PROFILE_DIAMONDS,
                    icon: "💎"
                },
                cp: {
                    idx: Indexes.PROFILE_CREATOR_POINTS,
                    icon: "🛠"
                },
                sc: {
                    idx: Indexes.PROFILE_SECRET_COINS,
                    icon: "🌕"
                },
                uc: {
                    idx: Indexes.PROFILE_USER_COINS,
                    icon: "⚪"
                },
                older: {
                    idx: Indexes.PROFILE_ACCOUNT_ID,
                    icon: ""
                }
            }
            if(Object.keys(initials).indexOf(context.args[0]) != -1){
                let players, initial = initials[context.args[0]];
                players = JSON.parse(getDataBase())
                    .filter(v => v.room == context.room)
                        .map(v => getPlayer(v.id).gd_profile);

                players.sort((a,b) => b[initial.idx] - a[initial.idx])

                return {s: "《{$1} Player Ranking {$1}》{$2}\n\n{$3}".format(initial.icon, all, players.map((v, i) => "{$1}위{$2} {$3}: {$4} {$5}"
                    .format(i+1, i<9 ? " |" : "|", v[Indexes.PROFILE_NAME], v[initial.idx], initial.icon))
                        .join("\n"))}
            } else {
                return {e: PrefixAttach.e("올바르지 않은 태그입니다.")}
            }
        }
    },
    account: {
        isOn: true,
        type: CIRCULATING_CMD,
        cooldown: 60000,
        next: ["id"],
        run: function(context){
            return {s: PrefixAttach.s("ACCOUNT ID를 입력해주세요.\n\nEx) !id 1234567")}
        },
        cycles: {
            id:{
                type: COMMON_CMD,
                next: ["code", "retry"],
                run: function(context){
                    if(!context.args[0]){
                        return {e: PrefixAttach.e("ACCOUNT ID를 입력해주세요.") };
                    } else {
                        let database, private_code, msg_client, sending_status;
                        database = JSON.parse(getDataBase());
                        if(database.find(v => v.room == context.room && v.sender == context.sender)){
                            return {e: PrefixAttach.e("이미 해당방에 계정이 존재합니다."), kill: true };
                        }
                        private_code = Cipher.encrypt(context.args[0]);
                        msg_client = new GDClient("msg", {toAccountID: context.args[0], subject: "CHECK YOUR PRIVATE CODE!", body: "CODE: " + private_code}, GDBOT_KEY).authicated();
                        sending_status = Client.sendPrivateMessage(msg_client);

                        Field.register(context.room, context.sender, {acc_id: context.args[0], client: msg_client, code: private_code});

                        if(sending_status == 404){
                            return {e: PrefixAttach.e("코드 전송에 실패했습니다.\n\n1. 유효한 계정의 ACCOUNT ID가 아닙니다.\n2. 메시지 허용 범위가 전체허용 상태가 아닙니다.\n\n:: !retry 명령어를 통해 코드를 재발급 받을 수 있습니다.") };
                        } else {
                            return {s: PrefixAttach.s("당신의 GD계정으로 코드를 전송했습니다.\n\nEx) !code 73920593250352") };
                        }
                    }
                }
            }, 
            retry: {
                type: COMMON_CMD,
                next: ["code", "retry"],
                run: function(context){
                    let field_data, sending_status;
                    field_data = Field.read(context.room, context.sender);
                    sending_status = Client.sendPrivateMessage(field_data.client);
                    if(sending_status == 404){
                        return {e: PrefixAttach.e("코드 전송에 실패했습니다.\n\n1. 유효한 계정의 ACCOUNT ID가 아닙니다.\n2. 메시지 허용 범위가 전체허용 상태가 아닙니다.\n\n:: !retry 명령어를 통해 코드를 재발급 받을 수 있습니다.") };
                    } else {
                        return {s: PrefixAttach.s("당신의 GD계정으로 코드를 전송했습니다.\n\nEx) !code 73920593250352") };
                    }
                }
            },
            code: {
                type: COMMON_CMD,
                next: [],
                run: function(context){
                    if(!context.args[0]){
                        return {e: PrefixAttach.e("CODE를 입력해주세요.") };
                    } else {
                        let field_data = Field.read(context.room, context.sender);

                        if(field_data.code != context.args[0]){
                            return {e: PrefixAttach.e("일치하지 않는 코드입니다.") };
                        } else {
                            initPlayer(context.room, context.sender, field_data.acc_id);

                            return {s: PrefixAttach.s("계정 연동을 완료했습니다.\n\n:: !profile을 통해 자신의 정보를 확인하세요."), kill: true };
                        }
                    }
                }
            }
        }
    },
    sync: {
        isOn: true,
        type: COMMON_CMD, 
        cooldown: 10000,
        run: function(context){
            let pl, database = JSON.parse(getDataBase()), id = context.args[0];
            if(!id) return { e: PrefixAttach.e("Account ID를 입력해주세요") };
            else {
                pl = database.findIndex(v => v.room == context.room && v.id == id);
                if(pl == -1) return { e: PrefixAttach.e("ID {$1} 인 유저는 존재하지 않습니다.".format(id)) };
                else {
                    database[pl].sender = context.sender;
                    saveDataBase(database);
                    return { s: PrefixAttach.s("Sync Successfully!") };
                }
            }
        }
    },
    profile: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 5000,
        run: function(context){
            let profile_id, profile_data, result;
            if(!context.args[0]){
                profile_id = findPlayer(context.room ,context.sender);
                if(profile_id == -1){
                    return {e: PrefixAttach.e("가입되지 않은 유저입니다.\n\n:: !register") };
                } else {
                    profile_data = getPlayer(profile_id);
                    profile_data = levelize(profile_data, 0);
                    result = Display.GDBotProfile(profile_data);

                    return {s: commentBuilder("당신의 프로필입니다.\n\n", result) };
                }
            } else {
                profile_id = findPlayer(context.room ,context.args[0]);
                if(profile_id == -1){
                    return {e: PrefixAttach.e("없는 유저입니다.\n\n:: !register") };
                } else {
                    profile_data = getPlayer(profile_id);
                    profile_data = levelize(profile_data, 0);
                    result = Display.GDBotProfile(profile_data);

                    return {s: commentBuilder(context.args[0], "의 프로필입니다.\n\n", result) };
                }
            }
        }
    },
    update: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 5000,
        run: function(context){
            let profile_id, profile_client, profile_data;
            profile_id = findPlayer(context.room, context.sender);
            if(profile_id == -1){
                return {e: PrefixAttach.e("가입되지 않은 유저입니다.\n\n:: !register") };
            } else {
                profile_client = new GDClient("user", {targetAccountID: profile_id});
                profile_data = Client.findGDUser(profile_client);

                if(!profile_data){
                    return {e: PrefixAttach.e("요청중 오류가 발생했습니다.")};
                } else {
                    editPlayer(profile_id, "gd_profile", profile_data);
                    return {s: PrefixAttach.s("유저 정보가 업데이트 되었습니다.")};
                }
            }
        }
    },
    tower: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 3000,
        run: function(context){
            let profile_id, profile_data, result;
            profile_id = findPlayer(context.room, context.sender);
            if(profile_id == -1){
                return {e: PrefixAttach.e("가입되지 않은 유저입니다.\n\n:: !register") };
            } else {
                let tower, record_client, record_data, per;
                profile_data = getPlayer(profile_id);
                tower = ScriptData.Tower[profile_data.tower];
                record_client = new GDClient("comment", {levelID: tower, page: 0, username: profile_data.gd_profile[Indexes.PROFILE_NAME]});
                record_data = Client.findRecordInComment(record_client);
                if(!record_data) return {e: PrefixAttach.e("등록된 기록이 없네요..") };

                per = Number(record_data.record[Indexes.COMMENT_LEVEL_PERCENTAGE]);
                if(per != 100){
                    return {e: PrefixAttach.e("아직 {$1}%가 부족하네요..".format((100-per))) };
                } else {
                    let next_client, next_data;
                    profile_data.tower++;
                    profile_data = levelize(profile_data, 100 + 10*profile_data.tower);

                    next_client = new GDClient("map", {str: ScriptData.Tower[profile_data.tower]} );
                    next_data = Client.findSingleGDMap(next_client);
                    savePlayer(profile_id, profile_data);
                
                    return {s: "{$1}층으로 향하고 있습니다...{$2}\n\n -- 보상 --\n  {$3} Exp\n  🏰 (+1)\n\n -- 다음 레벨 --\n\n{$4}".format(profile_data.tower+1, all, 100 + 10*profile_data.tower, Display.GDMapShortify(next_data.level, next_data.creator)) };
                }
            }          
        }
    },
    leaderboard: {
        isOn: true,
        type: COMMON_CMD, 
        cooldown: 10000,
        run: function (context){
            let strategy = context.args[0], count = context.args[1], client, result;
            if(!Array.in(["top", "creators", "fixedtop"], strategy)) return {e: PrefixAttach.e("검색 태그를 입력해주세요\n -> \"top\", \"creators\", \"fixedtop\"") };
            if(!count || count < 1 || count > 2000) count = 100;
            if(strategy == "fixedtop"){
                result = Jsoup.connect("https://gdbrowser.com/api/leaderboard?accurate&count={$1}".format(count))
                                            .ignoreContentType(true).get().body().text();
                result = JSON.parse(result);
                result = result.map((v, i) => {
                    return "  {$1}위 : 《{$2} 🌟》\n  {$3} {$4}\n    💎 {$5}".format(v.rank, v.stars, v.username, Font.SUPER_SCRIPT.apply("ID "+v.playerID), v.diamonds);
                });

                return {s: "{$1} {$2} Ranking {$1}\n                        {$5}{$3}\n\n{$4}".format("[🌟]", "Fixed-Top", all, result.join("\n"+line_L+"\n"), Font.SUPER_SCRIPT.apply("API by GDColon")) };
            } else {
                Api.replyRoom(context.room, PrefixAttach.i("잠시만 기다려주세요!"));
                client = new GDClient("leaderboard", {strategy: strategy, count: count});
                result = Client.getUserTop(client);
                result = result.map((v, i) => {
                    return "  {$1}위 : 《{$2}》\n  {$3} {$4}\n    {$5}".format(i+1,strategy == "top" ? v[Indexes.PROFILE_STARS] +" 🌟" : v[Indexes.PROFILE_CREATOR_POINTS]+" 🛠", v[Indexes.PROFILE_NAME], Font.SUPER_SCRIPT.apply("ID "+v[Indexes.PROFILE_PLAYER_ID]), strategy == "top" ? "💎 "+v[Indexes.PROFILE_DIAMONDS] : "🌟 "+v[Indexes.PROFILE_STARS]);
                });

                return {s: "{$1} {$2} Ranking {$1}{$3}\n\n{$4}".format(strategy == "top" ? "[🌟]" : "[🛠]", strategy == "top" ? "Top" : "Creator", all, result.join("\n"+line_L+"\n")) };
            }
        }
    },
    list: {
        isOn: true,
        type: COMMON_CMD,
        cooldown: 100000,
        run: function(context){
            let res, mlist, elist, llist, alist = Jsoup.connect("https://www.pointercrate.com/demonlist/").get()
                .select("nav#lists > div");
            mlist = alist.select("div#mainlist > ul > li").map(v => {
                let s = v.select("a").toString().split(" - ");
                let m = {
                    position: s[0].replace("#", ""),
                    name: s[1].split("<br>")[0],
                    creator: v.select("a > i").toString()
                }
                return [
                    "  🔖No. {$1}: {$2} \n".format(m.position, m.name),
                    "    ➡️ by {$1}\n".format(m.creator)
                ].join("");
            });

            elist = alist.select("div#extended > ul > li").map(v => {
                let s = v.select("a").toString().split(" - ");
                let m = {
                    position: s[0].replace("#", ""),
                    name: s[1].split("<br>")[0],
                    creator: v.select("a > i").toString()
                }
                return [
                    "  🔖No. {$1}: {$2} \n".format(m.position, m.name),
                    "    ➡️ by {$1}\n".format(m.creator)
                ].join("");
            });

            llist = alist.select("div#legacy > ul > li").map(v => {
                let s = v.select("a").toString().split(" - ");
                let m = {
                    position: s[0].replace("#", ""),
                    name: s[1].split("<br>")[0],
                    creator: v.select("a > i").toString()
                }
                return [
                    "  🔖No. {$1}: {$2} \n".format(m.position, m.name),
                    "    ➡️ by {$1}\n".format(m.creator)
                ].join("");
            });


            res = [
                "                        --🏅 Main List(1~75) 🏅--",
                "\n\n",
                mlist.join("\n\n"),
                "\n\n\n                   --🥈 Extended List(76~150) 🥈--\n\n",
                elist.join("\n\n"),
                "\n\n\n                         --🥉 Legacy List(151~) 🥉--\n\n",
                llist.join("\n\n")
            ].join("");

            return {s: "👑 Demonlist Ranking 👑{$1}\n\n{$2}".format(all, res) };
        }
    },
    GDBOT: {
        isOn: true,
        type: CIRCULATING_CMD,
        cooldown: 0,
        next: ["captcha", "retry"],
        run: function(context){
            Bot.captcha = 1024 + (Math.random()*700 | 0)
            Api.showToast("CAPTCHA: " + Bot.captcha);
            
            return {s: "당신은 로봇이 아닙니다.. 삐빅"};
        },
        cycles: {
            captcha: {
                type: COMMON_CMD,
                next: ["status", "eval", "this", "process", "ban", "clear"],
                run: function(context){
                    if(context.args[0] != Bot.captcha){
                        return {e: ["...?", "삐...삐빅?", "아이고 잘했다 우리 모질이 ㅎㅎ", "아니 이놈애 머 아는개 없내"][Math.random()*4 | 0] };
                    } else {
                        return {s: "Open: " + context.mills };
                    }
                }
            },
            retry: {
                type: COMMON_CMD,
                next: ["captcha", "retry"],
                run: function(context){
                    Bot.captcha = 1024 + (Math.random()*700 | 0)
                    Api.showToast("CAPTCHA: " + Bot.captcha);
                    
                    return {s: "당신은 로봇이 아닙니다.. 삐빅"};
                }
            },
            status: {
                type: COMMON_CMD,
                next: ["status", "eval", "this", "process", "ban", "clear"],
                run: function(context){
                    let data_count = JSON.parse(FileStream.read(PLAYER_ROUTE + "DATABASE.json")).length
                    return {s: commentBuilder("Runtime: ", ((context.mills - started) / 1000) | 0, "\n", "DATABASE: ", data_count, "\n", "CURRENT PROCESS: ", schedule.length, "\n", "COMMANDS STATUS: ", "\n\n", Command.absolute_cmd.map(v => v+": "+Command[v].isOn).join("\n")) };
                }
            },
            eval: {
                type: COMMON_CMD,
                next: ["status", "eval", "this", "process", "ban", "clear"],
                run: function(context){
                    let result;
                    try{
                        result = eval(context.args.join(" "));
                    } catch(e) {
                        return {e: e.toString()+"\n\nStack: "+e.stack};
                    }
                    return {s: result};
                }
            },
            process: {
                type: COMMON_CMD,
                next: ["status", "eval", "this", "process", "ban", "clear"],
                run: function(context){
                    return {s: "PROCESS LIST" + all + "\n\n" + schedule.map(v => commentBuilder("ROOM: ", v.room, "\n", "SENDER: ", v.sender, "\n", "PROVIDER: ", v.provider, "\n", "CMD: ", v.cmd)).join("\n\n") };
                }
            },
            clear: {
                type: COMMON_CMD,
                next: ["status", "eval", "this", "process", "ban", "clear"],
                run: function(context){
                    schedule = schedule.filter(v => v.provider == "GDBOT" && v.cmd > 2);
                    return {s: "ALL PROCESS CLEARED", kill: true };
                } 
            }
        }
    }
};
 
const RoomSetting = {

    "Geometry Dash Chatroom": {
        tower: {
            isOn: true 
        }
    },

    "Geometry Dash Creator School": {
    }

};
 
const Cooldowns = [
 
];
 
const response = function(room, message, sender, isGroupChat, replier, ImageDB, packageName){

    /* Commonplace conditions */
    if(!Bot.isOn || !Object.keys(RoomSetting).includes(room) || !message.startsWith(prefix) || message.length == 1) return; //if script is off, no permission in this room, not cmd, if blacklist user -> ignore

    /* whether cmd is exists or not */
    let scheduled = schedule.find(v => v.sender == sender & v.room == room);
    let request = message.split(seperator)[0].replace(prefix, "");
    if(scheduled === undefined && !Command.isExist(request)) return;
 
    /* Handling each cmd */
    if(RoomSetting[room][request] !== undefined){
        if(!RoomSetting[room][request].isOn) return;
    }

    /* Handling Cooldowns */
    try{
        if(Command[request].cooldown && Cooldowns.find(v => v.sender == sender && v.room == room) === undefined){
            Cooldowns.push({
                sender: sender,
                room: room,
                cool: Command[request].cooldown,
                end: new Date().getTime()+Command[request].cooldown
            });
        } else {
            if(!Command[request].cooldown){
                //nothing happen..
            } else {
                let cool = Cooldowns.find(v => v.sender == sender && v.room == room);
                if(cool.end > new Date().getTime()){
                    //hmm...
                    return;
                } else {
                    let idx = Cooldowns.findIndex(v => v.sender == sender && v.room == room);
                    Cooldowns.splice(idx, 1);
                }
            }
        }
    } catch(e) {
        //skip..
    }
    
    let context = {
        args: message.split(seperator).slice(1).map(v => v.split(ignoreSeperator).join(" ")),
        now: new Date(),
        mills: new Date().getTime(),
        sender: sender,
        room: room,
        isGroup: isGroupChat,
        image: ImageDB,
        packageName: packageName //I don't recommend to use this..
    }
    if(scheduled !== undefined){
        let idx = schedule.findIndex(v => v.sender == sender && v.room == room);
        if(request == "exit"){
            schedule.splice(idx, 1)
            replier.reply("Process Killed..");
            return;
        } else if(scheduled.cmd.indexOf(request) == -1){ //i use 'indexOf' because of 'includes' method's bug...
            if(absolute_cmd().indexOf(request) == -1) return;
            replier.reply(PrefixAttach.e("이전 작업을 종료합니다."));
            schedule.splice(idx, 1);
        } else {
            let task = Command[scheduled.provider].cycles[request];
            if(task.type === AUTHICATED_CMD){
                let allow = task.authication.level == MODERATOR_ALSO ? (Bot.moderator.includes(sender) || Bot.admin == sender) : Bot.admin == sender;
                if(!allow){
                    schedule.splice(idx, 1);
                    if(task.authication.no_permission_user_blocking){
                        replier.reply("No Permission!");
                        //Punish this user..
                    } else {
                        //forgive him..
                    }
                } else {
                    Command.do_this(scheduled.provider+":"+request, context, function(success, error, kill){
                        if(kill){
                            //do some task before kill
                            schedule.splice(idx, 1);
                            replier.reply(!error ? success : error);
                            return;
                        } else {
                            if(!error){
                                //do some task
                                replier.reply(success);
                                schedule[idx].cmd = task.next;
                            } else {
                                replier.reply(error);
                                //do some task
                            }
                        }
                    });
                }
            } else {
                Command.do_this(scheduled.provider+":"+request, context, function(success, error, kill){
                    if(kill){
                        //do some task before kill
                        replier.reply(!error ? success : error);
                        schedule.splice(idx, 1);
                        return;
                    } else {
                        if(!error){
                            //do some task
                            replier.reply(success);
                            schedule[idx].cmd = task.next;
                        } else {
                            replier.reply(error);
                            //do some task
                        }
                    }
                });
            }
        return;
        }
    }
    let type = Command.getType(request);
    if(type == COMMON_CMD){
        Command.do_this(request, context, function(success, error, pause){
            if(pause){
                return;
            } else {
                replier.reply(!error ? success : error);
            }
        });
    } else if(type == AUTHICATED_CMD){
        let allow = Command[request].authication.level == MODERATOR_ALSO ? (Bot.moderator.includes(sender) || Bot.admin == sender) : Bot.admin == sender;
        if(!allow){
            if(Command[request].authication.no_permission_user_blocking){
                replier.reply("You are not ADMIN..");
            } else {
                //forgive him..
            }
        } else {
            Command.do_this(request, context, function(success, error, pause){
                if(pause){
                    //do some task before return
                    return;
                } else {
                    //do some task before reply
                    replier.reply(!error ? success : error);
                }
            });
        }
    } else if(type == CIRCULATING_CMD){
        Command.do_this(request, context, function(success, error, kill){
            if(kill){
                if(success) replier.reply(success);
                else if(error) replier.reply(error);
                return;
            } else {
                replier.reply(!error ? success : error);
                schedule.push({
                    sender: sender,
                    room: room,
                    provider: request,
                    cmd: Command[request].next
                });
            }
        });
    }
}

function onCreate(savedInstanceState, activity) {
    importClass(android.os.StrictMode); 
    StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build()); //네트워크 통신 권한 얻기 (본인도 잘 모름..)

    var layout = new android.widget.LinearLayout(activity);
    var title = new android.widget.TextView(activity);
    var cmd = new android.widget.EditText(activity);
    var button1 = new android.widget.Button(activity);
    var on = new android.widget.Button(activity);
    var off = new android.widget.Button(activity);
    var result = new android.widget.TextView(activity);

    layout.setOrientation(android.widget.LinearLayout.VERTICAL);
    title.setText("My Bot Controller");
    title.setTextColor(android.graphics.Color.BLACK);
    button1.setText("run!");
    button1.setOnClickListener(new android.view.View.OnClickListener(){
        onClick: function (){
            try{
                var code = cmd.getText();
                res = eval(String(code));
                setAlertDialog("[Console]: 결과입니다",res, activity);
            } catch(e) {
                Api.showToast(e.toString());
            }
        }
    });

    layout.addView(title);
    layout.addView(cmd);
    layout.addView(button1);
    layout.addView(result);
    activity.setContentView(layout);

}

function setAlertDialog(title, text, activity){
    var adtest = new android.app.AlertDialog.Builder(activity);
    adtest.setTitle(String(title));
    adtest.setMessage(String(text));
    adtest.show();
}

function onResume(activity) {}
function onPause(activity) {}
function onStop(activity) {}