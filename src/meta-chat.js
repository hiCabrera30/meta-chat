const RS_start = (function(defaultConfig = null) {
var slice_size = 1000 * 1024;
Array.prototype.getIndex = function(by, value){
  return this.map(function (item) { return String(item[by]); }).indexOf(String(value));
};
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
String.prototype.strip = function() {
  var tmp = document.createElement('div');
  tmp.innerHTML = this;
  return tmp.innerText;
};

const d = {
  c: function(element) {
    return document.createElement(element);
  }
};

var c = {
  container: null,
  hiddenContainer: null,
  userId: null,
  name: null,
  state: new Object(),
  perPage: 20,
  width: 300,
  marginRight: 10,
  emoji: true,
  media: true,
  iconSize: 25,
  assetPath: '/node_modules/rs-chat/dist/images',
  socketUrl: 'http://localhost:8080/',
  imagePath: 'http://localhost:8080/', //alter
  supportedFile: ['jpg', 'png', 'gif','jpeg'],
  maxFileSize: 1048576,
  maxFileSizeError: 'File size must be less than 1 mb.',
  invalidFileMessage: 'You have selected a invalid file. The valid files are jpg, jpeg, png and gif.',
  maxWindow: function() {
    return parseInt(window.innerWidth / ( c.width + c.marginRight ) );
  },
  beforeDialogOpen: function(resolve, reject){ resolve(true); },
  afterDialogOpen: function() {},
  defaultTitle: document.getElementsByTagName('title')[0].innerHTML
}
if (defaultConfig) {
  c = extendDefaults(c, defaultConfig);
}

c.container = document.createElement('div');
c.container.className = 'chat_block_container';

document.body.appendChild(c.container);

c.hiddenContainer = document.createElement('div');
c.hiddenContainer.className = 'hiddenChat';

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var TAGS_BLOCK = [ 'p', 'div', 'pre', 'form' ];

var a = document.createElement('a');
a.className = 'hdnChtTgl';
a.innerHTML = '0 Chat More';

a.onclick = function(evt) {
  if(hiddenList.style.display == 'block') {
    hiddenList.style.display = 'none';
  } else {
    hiddenList.style.display = 'block';
  }
};

const assetComponent = `<span class="icons paperclip pointer">
  <input type="file" title="" class="pointer">
</span>`;
var hiddenList = document.createElement('div');
hiddenList.className = 'dropUp hide';

c.hiddenContainer.appendChild(hiddenList);
c.hiddenContainer.appendChild(a);

document.body.appendChild(c.hiddenContainer);

const Storage = function(param){
  var item = [];
  var key = param.key;
  var lsval = localStorage.getItem(key);
  if(lsval) {
    item = JSON.parse(lsval);
  }
  return {
    init: function() {
      lsval = localStorage.getItem(key);
      if(lsval) {
        item = JSON.parse(lsval);
      }
    },
    reorder: function() {
      for(var i in RSChat.boxes) {
      }
    },
    save: function(value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    add: function(val){
      var index;
      if((index = item.getIndex("id", val.id)) > -1) {
        item[index].state = 'opened';
        this.save(item);
      } else {
        item.push(val);
        this.save(item);
      }
    },
    update: function(id, object){
      var index;
      if((index = item.getIndex("id", id)) > -1) {
        if(object.hasOwnProperty('state')) {
          item[index].state = object.state;
          this.save(item);
        }
      }
    },
    remove: function(id){
      var index;
      if((index = item.getIndex("id", id)) > -1) {
        item.splice(index, 1);
        this.save(item);
      }
    },
    get: function(key){
    },
    getAll: function(key){
      return item;
    },
    count: function(){
      return item.length;
    }
  }
};

const emojis = [0x1f604, 0x1f603, 0x1f600, 0x1f60a, 0x263a, 0x1f609, 0x1f60d, 0x1f618, 0x1f61a, 0x1f617, 0x1f619, 0x1f61c, 0x1f61d, 0x1f61b, 0x1f633, 0x1f601, 0x1f614, 0x1f60c, 0x1f612, 0x1f61e, 0x1f623, 0x1f622, 0x1f602, 0x1f62d, 0x1f62a, 0x1f625, 0x1f630, 0x1f605, 0x1f613, 0x1f629, 0x1f62b, 0x1f628, 0x1f631, 0x1f620, 0x1f621, 0x1f624, 0x1f616, 0x1f606, 0x1f60b, 0x1f637, 0x1f60e, 0x1f634, 0x1f635, 0x1f632, 0x1f61f, 0x1f626, 0x1f627, 0x1f608, 0x1f47f, 0x1f62e, 0x1f62c, 0x1f610, 0x1f615, 0x1f62f, 0x1f636, 0x1f607, 0x1f60f, 0x1f611, 0x1f472, 0x1f473, 0x1f46e, 0x1f477, 0x1f482, 0x1f476, 0x1f466, 0x1f467,      0x1f468, 0x1f469, 0x1f474, 0x1f475, 0x1f471, 0x1f47c,      0x1f478, 0x1f63a, 0x1f638, 0x1f63b, 0x1f63d, 0x1f63c,      0x1f640, 0x1f63f, 0x1f639, 0x1f63e, 0x1f479, 0x1f47a, 0x1f648, 0x1f649, 0x1f64a, 0x1f480, 0x1f47d, 0x1f4a9, 0x1f525, 0x2728, 0x1f31f, 0x1f4ab, 0x1f4a5, 0x1f4a2, 0x1f4a6, 0x1f4a7, 0x1f4a4, 0x1f4a8, 0x1f442, 0x1f440, 0x1f443, 0x1f445, 0x1f444, 0x1f44d, 0x1f44e, 0x1f44c, 0x1f44a, 0x270a, 0x270c, 0x1f44b, 0x270b, 0x1f450, 0x1f446, 0x1f447, 0x1f449, 0x1f448, 0x1f64c, 0x1f64f, 0x261d, 0x1f44f, 0x1f4aa, 0x1f6b6, 0x1f3c3, 0x1f483, 0x1f46b, 0x1f46a, 0x1f46c, 0x1f46d, 0x1f48f, 0x1f491, 0x1f46f, 0x1f646, 0x1f645, 0x1f481, 0x1f64b, 0x1f486, 0x1f487, 0x1f485, 0x1f470, 0x1f64e, 0x1f64d, 0x1f647, 0x1f3a9, 0x1f451, 0x1f452, 0x1f45f, 0x1f45e, 0x1f461, 0x1f460, 0x1f462, 0x1f455, 0x1f454, 0x1f45a, 0x1f457, 0x1f3bd, 0x1f456, 0x1f458, 0x1f459, 0x1f4bc, 0x1f45c, 0x1f45d, 0x1f45b, 0x1f453, 0x1f380, 0x1f302, 0x1f484, 0x1f49b, 0x1f499, 0x1f49c, 0x1f49a, 0x2764, 0x1f494,  0x1f497, 0x1f493, 0x1f495, 0x1f496, 0x1f49e, 0x1f498, 0x1f48c, 0x1f48b, 0x1f48d, 0x1f48e, 0x1f464, 0x1f465,  0x1f4ac, 0x1f463, 0x1f4ad];
const allEmojis = [{
  type: "expression",
  emojis: emojis,
  icon: 0x1f604,
  sprite: 'emoji_spritesheet_0.png',
  dimensions: [27, 7],
}, {
  type: "animal",
  emojis: [0x1f436, 0x1f43a, 0x1f431, 0x1f42d, 0x1f439, 0x1f430,0x1f438, 0x1f42f, 0x1f428, 0x1f43b, 0x1f437, 0x1f43d, 0x1f42e, 0x1f417, 0x1f435, 0x1f412, 0x1f434, 0x1f411,0x1f418, 0x1f43c, 0x1f427, 0x1f426, 0x1f424, 0x1f425, 0x1f423, 0x1f414, 0x1f40d, 0x1f422, 0x1f41b, 0x1f41d, 0x1f41c, 0x1f41e, 0x1f40c, 0x1f419, 0x1f41a, 0x1f420, 0x1f41f, 0x1f42c, 0x1f433, 0x1f40b, 0x1f404, 0x1f40f, 0x1f400, 0x1f403, 0x1f405, 0x1f407, 0x1f409, 0x1f40e, 0x1f410, 0x1f413, 0x1f415, 0x1f416, 0x1f401, 0x1f402, 0x1f432, 0x1f421, 0x1f40a, 0x1f42b, 0x1f42a, 0x1f406, 0x1f408, 0x1f429, 0x1f43e, 0x1f490, 0x1f338, 0x1f337, 0x1f340, 0x1f339, 0x1f33b, 0x1f33a, 0x1f341, 0x1f343, 0x1f342, 0x1f33f, 0x1f33e, 0x1f344, 0x1f335, 0x1f334, 0x1f332, 0x1f333, 0x1f330, 0x1f331, 0x1f33c, 0x1f310, 0x1f31e, 0x1f31d, 0x1f31a, 0x1f311, 0x1f312, 0x1f313, 0x1f314, 0x1f315, 0x1f316, 0x1f317, 0x1f318, 0x1f31c, 0x1f31b, 0x1f319, 0x1f30d, 0x1f30e, 0x1f30f, 0x1f30b, 0x1f30c, 0x1f320, 0x2b50, 0x2600, 0x26c5, 0x2601, 0x26a1, 0x2614, 0x2744, 0x26c4, 0x1f300, 0x1f301,0x1f308, 0x1f30a],
  icon: 0x1f436,
  sprite: 'emoji_spritesheet_1.png',
  dimensions: [29, 4],
},{
  type: "bell",
  emojis: [0x1f38d, 0x1f49d, 0x1f38e, 0x1f392, 0x1f393, 0x1f38f, 0x1f386, 0x1f387, 0x1f390, 0x1f391, 0x1f383, 0x1f47b, 0x1f385, 0x1f384, 0x1f381, 0x1f38b, 0x1f389, 0x1f38a, 0x1f388, 0x1f38c, 0x1f52e, 0x1f3a5, 0x1f4f7, 0x1f4f9, 0x1f4fc, 0x1f4bf, 0x1f4c0, 0x1f4bd, 0x1f4be, 0x1f4bb, 0x1f4f1, 0x260e, 0x1f4de, 0x1f4df, 0x1f4e0, 0x1f4e1, 0x1f4fa, 0x1f4fb, 0x1f50a, 0x1f509, 0x1f508, 0x1f507, 0x1f514, 0x1f515, 0x1f4e3, 0x1f4e2, 0x23f3, 0x231b, 0x23f0, 0x231a, 0x1f513, 0x1f512, 0x1f50f, 0x1f510, 0x1f511, 0x1f50e, 0x1f4a1, 0x1f526, 0x1f506, 0x1f505, 0x1f50c, 0x1f50b, 0x1f50d, 0x1f6c0, 0x1f6c1, 0x1f6bf, 0x1f6bd, 0x1f527, 0x1f529, 0x1f528, 0x1f6aa, 0x1f6ac, 0x1f4a3, 0x1f52b, 0x1f52a, 0x1f48a, 0x1f489, 0x1f4b0,0x1f4b4, 0x1f4b5, 0x1f4b7, 0x1f4b6, 0x1f4b3, 0x1f4b8, 0x1f4f2, 0x1f4e7, 0x1f4e5, 0x1f4e4, 0x2709, 0x1f4e9, 0x1f4e8, 0x1f4ef, 0x1f4eb, 0x1f4ea, 0x1f4ec, 0x1f4ed, 0x1f4ee, 0x1f4e6, 0x1f4dd, 0x1f4c4, 0x1f4c3, 0x1f4d1, 0x1f4ca, 0x1f4c8, 0x1f4c9, 0x1f4dc, 0x1f4cb, 0x1f4c5, 0x1f4c6, 0x1f4c7, 0x1f4c1, 0x1f4c2, 0x2702, 0x1f4cc, 0x1f4ce, 0x2712, 0x270f, 0x1f4cf, 0x1f4d0, 0x1f4d5,0x1f4d7, 0x1f4d8, 0x1f4d9, 0x1f4d3, 0x1f4d4, 0x1f4d2, 0x1f4da, 0x1f4d6, 0x1f516, 0x1f4db, 0x1f52c, 0x1f52d, 0x1f4f0, 0x1f3a8, 0x1f3ac, 0x1f3a4, 0x1f3a7, 0x1f3bc, 0x1f3b5, 0x1f3b6, 0x1f3b9, 0x1f3bb, 0x1f3ba, 0x1f3b7, 0x1f3b8, 0x1f47e, 0x1f3ae, 0x1f0cf, 0x1f3b4, 0x1f004, 0x1f3b2, 0x1f3af, 0x1f3c8, 0x1f3c0, 0x26bd, 0x26be, 0x1f3be, 0x1f3b1, 0x1f3c9, 0x1f3b3, 0x26f3, 0x1f6b5,0x1f6b4, 0x1f3c1, 0x1f3c7, 0x1f3c6, 0x1f3bf, 0x1f3c2, 0x1f3ca, 0x1f3c4, 0x1f3a3, 0x2615, 0x1f375, 0x1f376, 0x1f37c, 0x1f37a, 0x1f37b, 0x1f378, 0x1f379, 0x1f377, 0x1f374, 0x1f355, 0x1f354, 0x1f35f, 0x1f357, 0x1f356,0x1f35d, 0x1f35b, 0x1f364, 0x1f371, 0x1f363, 0x1f365,0x1f359, 0x1f358, 0x1f35a, 0x1f35c, 0x1f372, 0x1f362, 0x1f361, 0x1f373, 0x1f35e, 0x1f369, 0x1f36e, 0x1f366, 0x1f368, 0x1f367, 0x1f382, 0x1f370, 0x1f36a, 0x1f36b, 0x1f36c, 0x1f36d, 0x1f36f, 0x1f34e, 0x1f34f, 0x1f34a, 0x1f34b, 0x1f352, 0x1f347, 0x1f349, 0x1f353, 0x1f351, 0x1f348, 0x1f34c, 0x1f350, 0x1f34d, 0x1f360, 0x1f346, 0x1f345, 0x1f33d],
  icon: 0x1f38d,
  sprite: 'emoji_spritesheet_2.png',
  dimensions: [33, 7],
},
{
  type: "car",
  emojis: [0x1f3e0, 0x1f3e1, 0x1f3eb, 0x1f3e2, 0x1f3e3, 0x1f3e5, 0x1f3e6, 0x1f3ea, 0x1f3e9, 0x1f3e8, 0x1f492, 0x26ea, 0x1f3ec, 0x1f3e4, 0x1f307, 0x1f306, 0x1f3ef, 0x1f3f0, 0x26fa, 0x1f3ed, 0x1f5fc, 0x1f5fe, 0x1f5fb, 0x1f304, 0x1f305, 0x1f303, 0x1f5fd, 0x1f309, 0x1f3a0, 0x1f3a1, 0x26f2, 0x1f3a2, 0x1f6a2, 0x26f5, 0x1f6a4, 0x1f6a3, 0x2693, 0x1f680, 0x2708, 0x1f4ba, 0x1f681, 0x1f682, 0x1f68a, 0x1f689, 0x1f69e, 0x1f686, 0x1f684, 0x1f685, 0x1f688, 0x1f687, 0x1f69d, 0x1f683, 0x1f68b, 0x1f68e, 0x1f68c, 0x1f68d, 0x1f699, 0x1f698, 0x1f697, 0x1f695, 0x1f696, 0x1f69b, 0x1f69a, 0x1f6a8, 0x1f693, 0x1f694, 0x1f692, 0x1f691, 0x1f690, 0x1f6b2, 0x1f6a1, 0x1f69f, 0x1f6a0, 0x1f69c, 0x1f488, 0x1f68f, 0x1f3ab, 0x1f6a6, 0x1f6a5, 0x26a0, 0x1f6a7, 0x1f530, 0x26fd, 0x1f3ee, 0x1f3b0, 0x2668, 0x1f5ff, 0x1f3aa, 0x1f3ad, 0x1f4cd,0x1f6a9 ],
  icon: 0x1f3e0,
  sprite: 'emoji_spritesheet_3.png',
  dimensions: [34, 3]
},
{
  type: "home",
  emojis: [ 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x0030, 0x1f51f, 0x1f522, 0x0023, 0x1f523, 0x2b06, 0x2b07, 0x2b05, 0x27a1, 0x1f520, 0x1f521, 0x1f524, 0x2197, 0x2196, 0x2198, 0x2199, 0x2194, 0x2195, 0x1f504, 0x25c0, 0x25b6, 0x1f53c, 0x1f53d, 0x21a9, 0x21aa, 0x2139, 0x23ea, 0x23e9, 0x23eb, 0x23ec, 0x2935, 0x2934, 0x1f197, 0x1f500, 0x1f501, 0x1f502, 0x1f195, 0x1f199, 0x1f192, 0x1f193, 0x1f196, 0x1f4f6, 0x1f3a6, 0x1f201, 0x1f22f, 0x1f233, 0x1f235, 0x1f234, 0x1f232, 0x1f250, 0x1f239, 0x1f23a, 0x1f236, 0x1f21a, 0x1f6bb, 0x1f6b9, 0x1f6ba, 0x1f6bc, 0x1f6be, 0x1f6b0, 0x1f6ae, 0x1f17f, 0x267f, 0x1f6ad, 0x1f237, 0x1f238, 0x1f202, 0x24c2, 0x1f6c2, 0x1f6c4, 0x1f6c5, 0x1f6c3, 0x1f251, 0x3299, 0x3297, 0x1f191, 0x1f198, 0x1f194, 0x1f6ab, 0x1f51e, 0x1f4f5, 0x1f6af, 0x1f6b1, 0x1f6b3, 0x1f6b7, 0x1f6b8, 0x26d4, 0x2733, 0x2747, 0x274e, 0x2705, 0x2734, 0x1f49f, 0x1f19a, 0x1f4f3, 0x1f4f4, 0x1f170, 0x1f171, 0x1f18e, 0x1f17e, 0x1f4a0, 0x27bf, 0x267b, 0x2648, 0x2649, 0x264a, 0x264b, 0x264c, 0x264d, 0x264e, 0x264f, 0x2650, 0x2651, 0x2652, 0x2653, 0x26ce, 0x1f52f, 0x1f3e7, 0x1f4b9, 0x1f4b2, 0x1f4b1, 0x00a9, 0x00ae, 0x2122, 0x274c, 0x203c, 0x2049, 0x2757, 0x2753, 0x2755, 0x2754, 0x2b55, 0x1f51d, 0x1f51a, 0x1f519, 0x1f51b, 0x1f51c, 0x1f503, 0x1f55b, 0x1f567, 0x1f550, 0x1f55c, 0x1f551, 0x1f55d, 0x1f552, 0x1f55e, 0x1f553, 0x1f55f, 0x1f554, 0x1f560, 0x1f555, 0x1f556, 0x1f557, 0x1f558, 0x1f559, 0x1f55a, 0x1f561, 0x1f562, 0x1f563, 0x1f564, 0x1f565, 0x1f566, 0x2716, 0x2795, 0x2796, 0x2797, 0x2660, 0x2665, 0x2663, 0x2666, 0x1f4ae, 0x1f4af, 0x2714, 0x2611, 0x1f518, 0x1f517, 0x27b0, 0x3030, 0x303d, 0x1f531, 0x25fc, 0x25fb, 0x25fe, 0x25fd, 0x25aa, 0x25ab, 0x1f53a, 0x1f532, 0x1f533, 0x26ab, 0x26aa, 0x1f534, 0x1f535, 0x1f53b, 0x2b1c, 0x2b1b, 0x1f536, 0x1f537, 0x1f538, 0x1f539 ],
  icon: 0x0031,
  sprite: 'emoji_spritesheet_4.png',
  dimensions: [34, 7],
},
];


const emoji = {
  expr: /[\ud800-\udbff][\udc00-\udfff]/g,
  unicodeRegex: /([\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}])/ug,
  hasSingleEmoji: (message) => {
    // return /^\p{Emoji}+$/ug.test(message) && 
    return message.length === 2;
  },
  render: (message) => {
    if(emoji.hasSingleEmoji(message)){  
      return emoji.bigEmoji(message.strip().trim()).trim();
    }
    return emoji.smallEmoji(message.strip()).trim();
  },
  bigEmoji: (message) => {
    return message.replace(emoji.unicodeRegex, (match, unicode) => {
        return EmojiStyleGenerator.generateEmojiImg(unicode.codePointAt())
    });
  },
  smallEmoji: (message) => {
    return message.replace(emoji.unicodeRegex, (match, unicode) => {
        return EmojiStyleGenerator.generateEmojiImg(unicode.codePointAt())
    });
  }

};


class EmojiStyleGenerator {
  static createImageStyles(options = {}) {

    const iconSize = c.iconSize;
    const assetPath = c.assetPath;

    let style = '';
    for (let g = 0; g < allEmojis.length; g++) {
      const group = allEmojis[g];
      const d = group.dimensions;

      for (let e = 0; e < group.emojis.length; e++) {
        const key = group.emojis[e];
          const row = e / d[0] | 0;
          const col = e % d[0];
          style += '.emoji-' + key + '{'
            + 'background: url(\'' + assetPath + '/' + group.sprite + '\') '
            + (-iconSize * col) + 'px '
            + (-iconSize * row) + 'px no-repeat;'
            + 'background-size: ' + (d[0] * iconSize) + 'px ' + (d[1] * iconSize) + 'px;'
            + '}';
        // }
      }
    }

    return style;
  }

  static injectImageStyles(element, options) {
    element = element || 'head';
    var style = document.createElement('style');

    style.innerHTML = EmojiStyleGenerator.createImageStyles(options);

    element = document.getElementsByTagName('head')[0];
    element.appendChild(style);
  }

  static generateEmojiImg(unicode) {
    return '<img class="imoji emoji-' + unicode + ' rs-imj-icon" src="' + c.assetPath + '/blank.gif" style="display:inline-block;width:25px;height:25px;" alt="' + unicode + '" />';
  }  
  static generateEmojiTag(unicode) {
    return '<i class="emoji emoji-' + unicode + ' emoji-image" contenteditable="false"><img class="imoji emoji-' + unicode + ' rs-imj-icon" src="' + c.assetPath + '/blank.gif" style="width:25px;height:25px;position:absolute;" alt="' + unicode + '" contenteditable="false" /></i>';
  }  
}

EmojiStyleGenerator.injectImageStyles(null, {});

var socket;

// Utility method to extend defaults with user options
function extendDefaults(source, properties) {
  var property;
  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      source[property] = properties[property];
    }
  }
  return source;
}

this.RSChat = (function(config) {
  return {
    boxes: {},
    init: function(config = null) {
      if (config) {
        c = extendDefaults(c, config);
      }
      c.state = new Storage({key: 'rsc_popup_state_' + c.userId});
      c.state.init();
      stablishConnection();

      c.state.getAll().forEach(function(item) {
        RSChat.start(item.id, item.name, item.state);
      });

    },
    start: function(id, name, state=null) {
      var _ = this;
      var userId = 'user_'+ id;
      if(this.boxes.hasOwnProperty(userId)) {
        this.boxes[userId].open();
        return;
      }

      new Promise(c.beforeDialogOpen).then(function(status) {
        _.boxes[userId] = new RSChatLayout(id, name);
        _.boxes[userId].init('opened');
        RSChat.reInitWindow();
      })
      .catch(function( status ){ });
      
    },
    newMessage: function(data) {
      var userId = 'user_'+ data.userId;
      if(this.boxes.hasOwnProperty(userId)){
        this.boxes[userId].createMsg(data);        
      }
      this.start(data.userId, data.name);
    }, 
    typing: function ( data ) {
      var userId = 'user_'+ data.userId;
      if(this.boxes.hasOwnProperty(userId)) {
        this.boxes[userId].typing(data);
      }
    },
    typingEnd: function ( data ) {
      var userId = 'user_'+ data.userId;
      if(this.boxes.hasOwnProperty(userId)) {
        this.boxes[userId].typingEnd(data);
      }
    },
    userOnlineState: function ( data ) {
      var userId = 'user_'+ data.userId;
      if(this.boxes.hasOwnProperty(userId)) {
        this.boxes[userId].setOnlineStatus(data);
      }
    },
    remove: function(id) {
      var userId = 'user_'+ id;
      if(this.boxes.hasOwnProperty(userId)) {
        delete this.boxes[userId];
        return true;
      }
    },
    reInitWindow: function() {
      var _ = this;
      var li = null;  
      var marginRight = 0;
      var maxWindow = parseInt((window.innerWidth - 100) / ( c.width + c.marginRight ) );

      c.hiddenContainer.style.display = 'none';
      var items = Object.keys(RSChat.boxes).reverse();
      if(items.length < maxWindow) { maxWindow = items.length; }
      for(var i =0; i < maxWindow; i++) {
        marginRight = i * (c.width + c.marginRight);
        this.boxes[items[i]].css({marginRight: marginRight + 'px', display: "block" });
        c.state.update(this.boxes[items[i]].id, {state: 'opened'});
      }

      hiddenList.innerHTML = '';
      a.innerHTML = (items.length - maxWindow ) + ' More Chat';
      for(var i = maxWindow; i < items.length; i++) {

        this.boxes[items[i]].css({display: "none"});
        this.boxes[items[i]].state = 'hidden';
        c.state.update(this.boxes[items[i]].id, {state: 'hidden'});
        
        c.hiddenContainer.style.display = 'block';
        li = document.createElement('a');
        li.innerHTML = this.boxes[items[i]].name;
          console.log(items[i]);
        
        (function(i){
          li.onclick = function(){    
            _.boxes[items[i]].open();
            hiddenList.style.display = 'none';
          }
        })(i);

        hiddenList.appendChild(li);
      }
    },
    getWindowToReplace: function() {
      for (var firstKey in this.boxes){
        if(this.boxes[firstKey].state == 'opened')
          break;
      } 
      return this.boxes[firstKey];
    }
  }
}());

const RSChatLayout = function(id, name){
  this.id = id;
  this.name = name;
  this.lastId = null;
  this.state = 'opened';
  this.loadPrevious = null;
  this.tpl = null;
  this.typingTpl = null;
  this.typingObj = null;
  this.lastTypingRequest = (new Date()).getTime();
  this.chatHolderWrppper = null;
  this.chatContent = null;
  this.activeBtn = null;
  this.placeholderDisplay = true;
  this.init = function(state) {
    this.state = state;
    c.container.appendChild(this.layout());
    if(state == 'opened') {
      c.state.add({id: this.id, name: this.name, state: 'opened'});
    }
    this.loadPrevious(true);
    this.getOnlineStatus();
  }
  this.getOnlineStatus = function() {
    var _ = this;
    socket.emit('is_online', { id: this.id }, function(data){
      _.setOnlineStatus(data);
    });
  }

  this.setOnlineStatus = function(data) {
    var _ = this;
    if(data.is_online == true) {
      _.activeBtn.className = 'small_green_circle bggreen online-status';
    } else {
      _.activeBtn.className = 'small_green_circle bgred online-status';
    }
  }

  this.layout = function() {
    let _ = this;
    this.tpl = document.createElement('div');
    this.tpl.__proto__.first = function(selector) {
      return this.querySelectorAll(selector)[0];
    }

    this.tpl.className = "rs-chat-dialog";
    this.tpl.innerHTML = `
      <div class="rs-chat-header primaryColor">
          <div class="userName colorwhite close-minimize-evt">
            <i class="small_green_circle bgred online-status"></i> ${_.name}
          </div>
        <div class="rsc-head-toobar colorwhite">
          <span class="cross icons"></span>
        </div>
      </div>
      <div class="chatHolderWrppper">
        <div class="chatHolder">
          <div class="load-previous"> Load Previous </div>
          <div class="chat-content"></div>
          <div class="typing"> 
            <div class="rs-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div class="chatTextArea">          
          <div style="font-size: 8px !important; position: absolute !important;right: 1px !important;margin-top: 2px !important;display:none !important;">Powered By RS Chat</div>
          <div contenteditable="true" type="text" data-emoji="true" placeholder="Type a message..." class="msg_area input"></div>
          <div class="middle-toolbar">
           ${c.media? assetComponent : '' }
           ${c.emoji? `<span class="icons emoji-btn"></span>&nbsp;` : '' }
            
          </diV>
        </div>
      </div>
      <div class="imojipopup">
        <div class="emojiList"></div>
        <div class="imojiFooter"></div>
      </div>
    `;

    if(c.media) {
      this.tpl.addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
      }, false);
      this.tpl.first('.paperclip').addEventListener('change', selectImage);
    }

  this.imojiFooter = this.tpl.querySelectorAll('.imojiFooter')[0];
  this.emojiList = this.tpl.querySelectorAll('.emojiList')[0];
  this.imojipopup = this.tpl.querySelectorAll('.imojipopup')[0];    
  this.activeBtn = this.tpl.querySelectorAll('.online-status')[0];
  this.loadPreviousBtn = this.tpl.querySelectorAll('.load-previous')[0];
  this.chatHolderWrppper = this.tpl.querySelectorAll('.chatHolderWrppper')[0];
  let minWindow = this.tpl.querySelectorAll('.close-minimize-evt');
  let msgArea = this.tpl.querySelectorAll('.msg_area')[0];
  this.chatContent = this.tpl.querySelectorAll('.chat-content')[0];
  this.typingTpl = this.tpl.querySelectorAll('.typing')[0];
  this.chatHolder = this.tpl.querySelectorAll('.chatHolder')[0];
  
  this.tpl.querySelectorAll('.cross')[0].addEventListener('click', close);
  
  if(c.emoji) {
    this.emojiBtn = this.tpl.querySelectorAll('.emoji-btn')[0];
    this.emojiBtn.onclick = function(evt) {
      if(_.imojipopup.style.display == 'block') {
        _.imojipopup.style.display = 'none';
        return;
      }
      _.drawEmoji();
      _.imojipopup.style.display = 'block';
    };
  }

  this.drawEmoji = function(type = 'expression') {

      _.emojiList.innerHTML = '';
      allEmojis.filter(item => item.type == type)
        .map((emoji) => {

          emoji.emojis.map((item) => {
            const emojiLink = document.createElement('span')
            emojiLink.className = `imoji emoji-${item} rs-imj-icon`;
            emojiLink.setAttribute("contenteditable", "false");

            emojiLink.innerHTML = `<span class="imoji" data-item="${item}">` 
              + String.fromCodePoint(item) + '</span>';

            emojiLink.onclick = function(event) {

              var i = document.createElement('i')
              i.style = 'display:inline-block;width:25px;height:25px;position:relative;';
              i.setAttribute('contenteditable', 'false');

              var img = document.createElement('img')              
              img.src = c.assetPath + '/blank.gif';
              img.className = `imoji emoji-${item} rs-imj-icon`;
              img.style = 'width:25px;height:25px;';
              img.alt = String.fromCodePoint(item);
  
              msgArea.appendChild(img);
              _.imojipopup.style.display = 'none';
            }
            _.emojiList.appendChild(emojiLink);
          });
      });
  };

  this.drawEmojiType = function() {
    allEmojis.map((item) => {
        const emojiLink = document.createElement('span')
        emojiLink.className = `imoji emoji-${item.icon} rs-imj-icon`;
        emojiLink.innerHTML = '<span class="imoji">' 
          + String.fromCodePoint(item.icon) + '</span>';
        emojiLink.onclick = function(event) {
          _.drawEmoji(item.type);
        }

        _.imojiFooter.appendChild(emojiLink);
    });

  };
  this.drawEmojiType();
  this.drawEmoji();

  function close() {
    c.state.remove(_.id);
    _.tpl.remove();
    RSChat.remove(_.id);
    RSChat.reInitWindow(); 
  }
 


  function selectImage(evt) {

    evt.preventDefault();

    var messageObj;
    var reader = new FileReader(), reader2 = new FileReader();
    var file = evt.target.files[0];
    var fileType = file.type.split('/');

    if(file.size > c.maxFileSize) {
      alert(c.maxFileSizeError);
      return;
    }

    if(c.supportedFile.indexOf(fileType[1]) === -1) {
      evt.target.value = '';
      alert(c.invalidFileMessage);
      return;
    }

    reader2.onloadend = function( event ) {
      if ( event.target.readyState !== FileReader.DONE ) {
        return;
      }
      messageObj = _.createMsg({
        userId: c.userId,
        toId: _.id,
        msg: event.target.result,
        type: 1
      });
    }
    
    reader2.readAsDataURL( file );

    evt.target.value = '';

    var obj = {
      name: file.name,
      start: 0,
      type: file.type,
      onse: (new Date()).getTime()
    };

    function upload_file( param ) {
      var next_slice = param.start + slice_size + 1;
      var blob = file.slice( param.start, next_slice );

      reader.onloadend = function( event ) {
        if ( event.target.readyState !== FileReader.DONE ) {
          return;
        }

        socket.emit('upload_file', {
          name : obj.name, 
          data : event.target.result,
          type: obj.type,
          onse: obj.onse
        }, function(res) {

          if(res) {
            var size_done = param.start + slice_size;
            var percent_done = Math.floor( ( size_done / file.size ) * 100 );

            messageObj.progress(percent_done);
            if ( next_slice < file.size ) {
              upload_file({
                start: next_slice
              });
            } else {

              messageObj.complete();
              socket.emit('send', {
                userId: c.userId,
                toId: _.id,
                msg: res.fullPath,
                type: 1
              });
            }
          }
        });
      };

      reader.readAsDataURL( blob );
    }
    upload_file(obj);

  }



  minWindow[0].onclick = function(){

    if(_.chatHolderWrppper.className.indexOf('hidden') > -1) {
      c.state.update(_.id, {state: 'opened'});
    } else {
      c.state.update(_.id, {state: 'minimize'});
    }
    _.chatHolderWrppper.classList.toggle('hidden');
  }
  
  msgArea.onkeyup = function(evt) {
    if(_.lastTypingRequest <= (new Date()).getTime()) {
      _.lastTypingRequest = (new Date()).getTime() + 3000;
      socket.emit('typing', {
        userId: c.userId,
        toId: _.id
      });
    }
      
    if(!_.val().trim()){ return; }
    if(evt.keyCode == 13 && !evt.shiftKey) {
      let msgObject = {
        userId: c.userId,
        toId: _.id,
        msg: _.val().trim()
      };

      socket.emit('send', msgObject);
      _.createMsg(msgObject);
      this.innerHTML = '';
    }
  };

    this.val = function() {
    var lines = [];
    var line = [];

    var flush = function() {
      lines.push(line.join(''));
      line = [];
    };

    var sanitizeNode = function(node) {
      if (node.nodeType === TEXT_NODE) {
        line.push(node.nodeValue);
      } else if (node.nodeType === ELEMENT_NODE) {
        var tagName = node.tagName.toLowerCase();
        var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;

        if (isBlock && line.length)
          flush();

        if (tagName === 'img') {
          var alt = node.getAttribute('alt') || '';
          if (alt) {
              line.push(alt);
          }
          return;
        } else if (tagName === 'br') {
          flush();
        }

        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
           sanitizeNode(children[i]);
        }

        if (isBlock && line.length)
          flush();
      }
    };

    var children = msgArea.childNodes;

    for (var i = 0; i < children.length; i++) {
      sanitizeNode(children[i]);
    }

    if (line.length)
      flush();

    return lines.join('\n');
  };

    this.loadPreviousBtn.onclick = function(evt){
      _.loadPrevious();
    };
    return this.tpl;
  }

  this.css = (data) => {
    if(data.hasOwnProperty('marginRight')) {
      this.tpl.style.marginRight = data.marginRight;
    }
    if(data.hasOwnProperty('display')) {
      this.tpl.style.display = data.display;
    }
  }
  this.loadPrevious = function(scroll=false) {
    let _ = this;
    socket.emit('get_history', { toId: _.id , userId: c.userId, lastId: _.lastId, perPage: c.perPage }, function(data){

      if(data.messages.length < c.perPage) {
        _.loadPreviousBtn.style.display = 'none';
      }
      if(data.messages.length > 0) {
        data.messages.forEach(item => {
          _.lastId = item.id;
          _.createPreviousMsg(item, scroll);
        });
      }
    });
  }
  
  this.open = function() {
    if(this.state == 'hidden') {
      let obj = RSChat.boxes['user_' + this.id];
      delete RSChat.boxes['user_' + this.id];
      RSChat.boxes['user_' + this.id] = obj;
      c.state.reorder();
    }
    this.chatHolderWrppper.style.display = 'block';
    c.state.add({id: id, name: name, state: 'opened'});
    RSChat.reInitWindow();
  }

  this.typing = function ( data ) {
    var _  = this;
    this.typingTpl.style.display = 'block';
    // _.scrollToBottom();
    this.typingObj = setTimeout(function(){
      _.typingTpl.style.display = 'none';
    }, 4000);
  },

  this.typingEnd = function ( data ) {
    this.typingTpl.style.display = 'none';
  },
  this.createMsg = function(data) {
    var messageObj = this.msgTpl(data);
    this.chatContent.appendChild(messageObj.html);
    // this.chatContent.insertAdjacentHTML(
    //   'beforeend', messageObj.html 
    // );
    this.scrollToBottom();
    return messageObj;
  },
  this.createPreviousMsg = function(data, scroll=true) {
    var messageObj = this.msgTpl(data);
    this.chatContent.prepend(messageObj.html);
    if(scroll) { this.scrollToBottom(); }
    return messageObj;
  },
  this.scrollToBottom = function() {
    var _ = this;
    this.chatHolder.scroll({top: this.chatHolder.scrollHeight, behaviour: 'smooth'})
    setTimeout( function() {
      _.chatHolder.scroll({top: _.chatHolder.scrollHeight, behaviour: 'smooth'})
    }, 500);
  },
  this.msgTpl = function(data) {
    return new ChatMessage(data);    
  }
};

const ChatMessage = function(data) {

  var loader, img, infoBar;
  var tpl = d.c('div');
  var tpl2 = d.c('div');
  tpl.className = 'chatRow';
  tpl2.className = 'chatR';
  data.type = parseInt(data.type);

  tpl.appendChild(tpl2);

  function render() {
    var error = null;
    if(data.toId == c.userId) {
      tpl2.className = 'chatL';
    }

    if(data.type == 1) {

      
      img = d.c('img');
      img.setAttribute('width', '100%');

      img.onerror = function() {
        if(!error) {
          error = 'test';
          img.setAttribute('src', c.imagePath + '/' + c.assetPath + '/noimage.png'); // alter
          // img.setAttribute('src', c.socketUrl + c.assetPath + '/noimage.png');
        }
      }

      if(data.msg.indexOf('base64') === -1) {
        data.msg = c.imagePath +'/'+ data.msg;
      } else {

        infoBar = d.c('div');
        infoBar.className = "info-bar";
        infoBar.innerHTML = '10%';

        loader = d.c('div')
        loader.className = "image-loader";
        loader.innerHTML = '<div id="loader"></div>';

        loader.appendChild(infoBar);        
        tpl2.appendChild(loader);        
      }

      /**
       * Base 64 upload and
       */
      img.setAttribute('src', data.msg);
      tpl2.appendChild(img);
    } else {
      tpl2.innerHTML = emoji.render(data.msg);
    }

  }

  render();
  return {
    html: tpl,
    progress: function(percent) {
      if(infoBar) {
        infoBar.innerHTML = percent + '%';
      }
    },
    complete: function() {
      loader.remove();
    }
  }
}

function stablishConnection() {
  socket = io(c.socketUrl);

  socket.on('connect', function(msg){
      
    socket.emit('createSession', {
      userId: c.userId,
      name: c.name
    });

  });

  socket.on('history', function (result) {
    result.messages.forEach(msg => {
      RSChat.newMessage(msg);      
    })
  });

  socket.on('message', function (msg) {
    if(!document.hasFocus()) {
      newTitle('New Message');
    }
    RSChat.newMessage( msg );
    RSChat.typingEnd( msg );
  });

  socket.on('friend_typing', function ( data ) {
    RSChat.typing( data );
  });

  socket.on('user_online_state', function ( data ) {
    RSChat.userOnlineState( data );
  });
}

function newTitle(title) {
  document.title = title;
}

window.addEventListener('resize', function(){
  RSChat.reInitWindow();
});

window.addEventListener('focus', function(){
    document.title = c.defaultTitle;
});

});