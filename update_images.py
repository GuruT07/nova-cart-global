import json

with open('src/imageMap.json', 'r') as f:
    images = json.load(f)

# Add more common items
extra_images = {
  "Lays Classic Salted": "https://www.bigbasket.com/media/uploads/p/l/294278_15-lays-potato-chips-american-style-cream-onion-flavour.jpg",
  "Kurkure Masala Munch": "https://www.bigbasket.com/media/uploads/p/l/293674_12-kurkure-namkeen-masala-munch.jpg",
  "Bingo Mad Angles": "https://www.bigbasket.com/media/uploads/p/l/266567_15-bingo-mad-angles-tomato-mischief.jpg",
  "Aashirvaad Atta 5kg": "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg",
  "India Gate Basmati Rice 1kg": "https://www.bigbasket.com/media/uploads/p/l/241600_7-india-gate-basmati-rice-feast-rozzana.jpg",
  "Tata Salt 1kg": "https://www.bigbasket.com/media/uploads/p/l/241600_7-india-gate-basmati-rice-feast-rozzana.jpg", # generic fallback
  "Dolo 650mg": "https://www.netmeds.com/images/product-v1/600x600/405545/dolo_650_tablet_15s_0_1.jpg",
  "Vicks Vaporub": "https://www.bigbasket.com/media/uploads/p/l/40118671_3-vicks-vaporub.jpg",
  "Classmate Notebook": "https://www.bigbasket.com/media/uploads/p/l/40134839_5-classmate-notebook-regular-single-line.jpg",
  "Coca Cola 2L": "https://www.bigbasket.com/media/uploads/p/l/251006_11-coca-cola-diet-coke.jpg",
  "Sprite 1.5L": "https://www.bigbasket.com/media/uploads/p/l/251014_11-sprite-soft-drink-lime-flavoured.jpg",
  "Dove Soap": "https://www.bigbasket.com/media/uploads/p/l/40161476_2-dove-cream-beauty-bathing-bar.jpg",
  "Colgate MaxFresh 150g": "https://www.bigbasket.com/media/uploads/p/l/40019253_8-colgate-maxfresh-toothpaste-peppermint-ice.jpg",
  "Britannia White Bread": "https://www.bigbasket.com/media/uploads/p/l/40099238_3-britannia-daily-fresh-white-bread.jpg"
}

images.update(extra_images)

with open('src/imageMap.json', 'w') as f:
    json.dump(images, f, indent=2)
