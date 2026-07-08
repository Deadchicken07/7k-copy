// Hero catalog organized by tier. Order: Awake → Legend++ → Legend+(7K) → Legend+ → Legend → Rare.
const HERO_TIERS = [
  {
    tier: 1, label: "Awake", folder: "Awake",
    names: [
      "ซิลเวสตา Awake", "สกัลด์ Awake", "ออร์ก้า Awake", "เคลมิส Awake",
      "เดลโลนส์ Awake", "เฮฟเว่นเนีย Awake", "เฮเลเนีย Awake",
    ],
  },
  {
    tier: 2, label: "Legend++", folder: "Legend++",
    names: ["มิเลีย", "จูริ", "โรซี่", "เกลิดัส", "ไพร์"],
  },
  {
    tier: 3, label: "Legend+ (7K)", folder: "Legend+/7K",
    names: ["คริส", "วาเนสซา", "ลูดี้", "เจฟ", "สไปค์", "ราเชล", "ไอลีน"],
  },
  {
    tier: 4, label: "Legend+", folder: "Legend+",
    names: [
      "ซิลเวสตา", "สกัลด์", "ออร์ก้า", "เคลมิส", "เดลโลนส์",
      "เรกินเลฟ", "เมลคีร์", "เอลิเซีย", "เอซ", "เฟรยา", "เพลตัน", "ไคล์",
      "โอม๊ก", "ไรอัน", "แรนด์กริด", "แทโอ", "โคลท์", "แร็ดกริด",
      "บิสกิต", "บรันซ์ & บรันเซล", "พาลานอส", "พยัคฆ์เมฆา", "ซุนหงอคง",
      "นาจา", "ธรูด", "อากีลา", "ออร์ลี่", "ยอนฮี", "มิสต์", "ลิโป้",
      "ริน", "ซองจินอู", "คาร์ม่า", "คางุระ", "คิริเอล", "คาร์ล เฮรอน",
    ],
  },
  {
    tier: 5, label: "Legend", folder: "Legend",
    names: [
      "ทากะ", "ซีค", "บาลิสต้า", "น็อกซ์", "กวนอู", "ชาแฮอิน", "ชานซะเลอร์",
      "ลุค", "รีน่า", "อลิส", "ลูลี่", "พีดัม", "ปาสตาล", "ยูชิน", "มิโฮะ",
      "เบลลีก้า", "เนีย", "เอมิเลีย", "เสี่ยวเฉียว", "เซอิน", "อารากอน",
      "เตียวเสี้ยน", "เดซี่", "แทอู๊ด", "เอสปาด้า", "ไป่เจียว", "ไป่หลง",
    ],
  },
  {
    tier: 6, label: "Rare", folder: "Rare",
    names: [
      "คาริน", "คารอน", "คลีโอ", "จูพี้", "จิน", "จูล่ง", "ซาร่า", "ซิลเวีย",
      "ยูจินโฮ", "ยูริ", "ยูอิ", "ลาเนีย", "ลี", "ลีโอ", "ลูซี่", "วิคตอเรีย",
      "สนิปเปอร์", "หลิงหลิง", "อสุรา", "อีจูฮี", "อีวาน", "เจน", "เซร่า",
      "เบน", "เมย์", "เรย์", "เสี่ยว", "เฟิงเยี่ยน", "เฮฟเว่นเนีย", "เฮเลเนีย",
      "เอเรียล", "แคทตี้", "แบล็กโรส", "แรคคูน", "โคลอี้", "โจ๊กเกอร์",
      "โซอี", "โนโฮ", "โฮกิ้น",
    ],
  },
];

const HEROES = HERO_TIERS.flatMap(({ tier, label, folder, names }) =>
  names.map((name) => ({
    id: name,
    name,
    tier,
    tierLabel: label,
    img: `images/${folder}/${name}.png`,
  }))
);

const HERO_BY_ID = Object.fromEntries(HEROES.map((h) => [h.id, h]));
const NO_PICTURE = "images/NoPicture.png";

const HERO_ALIASES = {
  "ซุนหงอคง":       ["ลิง"],
  "เกลิดัส":        ["ป๋า"],
  "โรซี่":          ["พระแม่"],
  "ลิโป้":          ["ม้า"],
  "แรนด์กริด":      ["ม้า"],
  "บรันซ์ & บรันเซล": ["แฝด"],
};

function getHero(id) {
  return HERO_BY_ID[id] || null;
}

function heroMatchesQuery(hero, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (hero.name.toLowerCase().includes(q)) return true;
  return (HERO_ALIASES[hero.id] || []).some((alias) => alias.toLowerCase().includes(q));
}
