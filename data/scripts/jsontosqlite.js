const categoryJson = `[
  {
    "name": "Morning Dhikr",
    "nameAr": "أذكار الصباح",
    "slug": "morning-dhikr",
    "tags": ["morning", "dhikr", "fajr", "morning adhkar", "اذكار", "الصباح"]
  },
  {
    "name": "Evening Dhikr",
    "nameAr": "أذكار المساء",
    "slug": "evening-dhikr",
    "tags": ["evening", "dhikr", "maghrib", "night adhkar", "اذكار", "المساء"]
  },
  {
    "name": "Daily Dua",
    "nameAr": "الدعاء اليومي",
    "slug": "daily-dua",
    "tags": ["daily", "dua", "supplication", "daily prayer", "دعاء", "يومي"]
  },
  {
    "name": "Selected Dua",
    "nameAr": "أدعية مختارة",
    "slug": "selected-dua",
    "tags": ["selected", "dua", "recommended", "important", "أدعية", "مختارة"]
  },
  {
    "name": "Dhikr After Salah",
    "nameAr": "أذكار بعد الصلاة",
    "slug": "dhikr-after-salah",
    "tags": ["after salah", "tasbeeh", "prayer dhikr", "post prayer", "اذكار", "بعد الصلاة"]
  }
]`;
//console.log("Category JSON", categoryJson);

/*interface Category {
  name: string;
  nameAr: string;
  slug: string;
}*/

const categories = JSON.parse(categoryJson);

for (const category of categories) {
    console.log(category.name, "-", category.nameAr, "-", category.slug);
}

const statements = [];

for (const category of categories) {
    //console.log(category.name, " - ", category.slug);
    statements.push(`INSERT INTO dua_category(name_en,name_ar,search_tag) VALUES('${category.name}', '${category.nameAr}', '${JSON.stringify(category.tags)}');`)
}

for (const statement of statements) {
    console.log(statement);
}