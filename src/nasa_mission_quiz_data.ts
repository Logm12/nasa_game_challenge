/**
 * NASA Space Apps Challenge 2026 - Educational Quiz & Geological Sampling Data
 * Based on Planetary Reconnaissance & OSIRIS-REx Sample Return Mission Design
 */

export interface CelestialQuizItem {
  id: string;
  nameVi: string;
  nameEn: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  diameter: string;
  mass: string;
  temperature: string;
  gravity: string;
  questionEn: string;
  questionVi: string;
  optionsEn: [string, string, string, string];
  optionsVi: [string, string, string, string];
  answerIndex: number; // 0=A, 1=B, 2=C, 3=D
  explanationEn: string;
  explanationVi: string;
  primaryColor: string;
  textureFile?: string;
}

export const CELESTIAL_QUIZ_DATA: Record<string, CelestialQuizItem> = {
  sun: {
    id: 'sun',
    nameVi: 'Mặt Trời',
    nameEn: 'The Sun',
    titleVi: 'Ngôi sao trung tâm Thái Dương Hệ',
    titleEn: 'Central Star of the Solar System',
    descVi: 'Ngôi sao ở trung tâm Hệ Mặt Trời của chúng ta. Nó tạo ra nhiệt lượng và ánh sáng khổng lồ, cung cấp năng lượng cần thiết cho sự sống trên Trái Đất.',
    descEn: 'The star at the center of our Solar System. It produces enormous amounts of heat and light, providing the energy needed for life on Earth.',
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    temperature: '5,500°C (Bề mặt) / 15,000,000°C (Lõi)',
    gravity: '274 m/s² (28.0g)',
    questionEn: "What is the Sun's main role in our Solar System?",
    questionVi: 'Vai trò chính của Mặt Trời trong Hệ Mặt Trời là gì?',
    optionsEn: [
      'A. It is the largest planet.',
      'B. It provides heat and light to the Solar System.',
      'C. It is a moon orbiting Earth.',
      'D. It is made entirely of solid rock.'
    ],
    optionsVi: [
      'A. Là hành tinh lớn nhất.',
      'B. Cung cấp nhiệt lượng và ánh sáng cho Hệ Mặt Trời.',
      'C. Là một mặt trăng quay quanh Trái Đất.',
      'D. Được cấu tạo hoàn toàn bằng đá rắn.'
    ],
    answerIndex: 1,
    explanationEn: 'The Sun is a G-type star that powers the Solar System through nuclear fusion, emitting vital light and warmth.',
    explanationVi: 'Mặt Trời là ngôi sao quang phổ loại G, tạo ra năng lượng từ phản ứng nhiệt hạch cung cấp ánh sáng và nhiệt độ cho Trái Đất.',
    primaryColor: '#ffaa00'
  },
  mercury: {
    id: 'mercury',
    nameVi: 'Sao Thủy',
    nameEn: 'Mercury',
    titleVi: 'Hành tinh gần Mặt Trời nhất',
    titleEn: 'Innermost Terrestrial Planet',
    descVi: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất. Nó có bề mặt đá gồ ghề phủ đầy miệng hố va chạm và trải qua sự chênh lệch nhiệt độ cực đại giữa ngày và đêm.',
    descEn: 'The smallest planet and the closest to the Sun. It has a rocky surface covered with many impact craters and experiences extreme temperature changes between day and night.',
    diameter: '4,879 km',
    mass: '3.30 × 10²³ kg',
    temperature: '-180°C (Đêm) đến 430°C (Ngày)',
    gravity: '3.70 m/s² (0.38g)',
    questionEn: 'Which statement about Mercury is correct?',
    questionVi: 'Nhận định nào sau đây về Sao Thủy là chính xác?',
    optionsEn: [
      'A. It is the hottest planet in the Solar System.',
      'B. It has large oceans of liquid water.',
      'C. It is the smallest planet and closest to the Sun.',
      'D. It has thick clouds and large rings.'
    ],
    optionsVi: [
      'A. Là hành tinh nóng nhất trong Hệ Mặt Trời.',
      'B. Có các đại dương nước lỏng rộng lớn.',
      'C. Là hành tinh nhỏ nhất và gần Mặt Trời nhất.',
      'D. Có các đám mây dày đặc và vành đai lớn.'
    ],
    answerIndex: 2,
    explanationEn: 'Mercury is the smallest planet and closest to the Sun, but Venus is hotter due to its greenhouse effect.',
    explanationVi: 'Sao Thủy là hành tinh nhỏ nhất và ở gần Mặt Trời nhất (dù gần nhất nhưng Sao Kim mới là hành tinh nóng nhất do hiệu ứng nhà kính).',
    primaryColor: '#94a3b8'
  },
  venus: {
    id: 'venus',
    nameVi: 'Sao Kim',
    nameEn: 'Venus',
    titleVi: 'Hành tinh có hiệu ứng nhà kính cực độ',
    titleEn: 'Runaway Greenhouse Inferno',
    descVi: 'Hành tinh nóng nhất trong Hệ Mặt Trời. Bầu khí quyển dày đặc của nó chủ yếu gồm carbon dioxide (CO₂), giữ nhiệt và tạo ra nhiệt độ bề mặt cực cao.',
    descEn: 'The hottest planet in the Solar System. Its thick atmosphere is mainly made of carbon dioxide (CO₂), which traps heat and creates extremely high surface temperatures.',
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    temperature: '465°C (Nóng nhất Thái Dương Hệ)',
    gravity: '8.87 m/s² (0.90g)',
    questionEn: 'Why is Venus the hottest planet in the Solar System?',
    questionVi: 'Tại sao Sao Kim lại là hành tinh nóng nhất trong Hệ Mặt Trời?',
    optionsEn: [
      'A. It is the closest planet to the Sun.',
      'B. Its thick carbon dioxide atmosphere traps heat.',
      'C. Its surface is covered with burning volcanoes.',
      'D. It produces its own heat like a star.'
    ],
    optionsVi: [
      'A. Vì nó là hành tinh gần Mặt Trời nhất.',
      'B. Bầu khí quyển CO₂ dày đặc giữ nhiệt cực mạnh (hiệu ứng nhà kính).',
      'C. Bề mặt phủ đầy núi lửa đang phun trào rực lửa.',
      'D. Nó tự phát ra nhiệt như một ngôi sao.'
    ],
    answerIndex: 1,
    explanationEn: 'Venus suffers from a runaway greenhouse effect where 96.5% CO2 traps solar heat, raising surface temp to 465°C.',
    explanationVi: 'Bầu khí quyển chứa 96.5% khí CO2 tạo ra hiệu ứng nhà kính mất kiểm soát, giữ nhiệt độ bề mặt luôn ở mức 465°C.',
    primaryColor: '#e6c280'
  },
  earth: {
    id: 'earth',
    nameVi: 'Trái Đất',
    nameEn: 'Earth',
    titleVi: 'Cái nôi duy nhất của sự sống',
    titleEn: 'Planetary Cradle of Life',
    descVi: 'Hành tinh duy nhất được biết đến có hỗ trợ sự sống. Nó có các đại dương chất lỏng, các lục địa, bầu khí quyển bảo vệ và nhiệt độ thích hợp cho sinh vật.',
    descEn: 'The only planet known to support life. It has liquid oceans, continents, a protective atmosphere, and suitable temperatures for living organisms.',
    diameter: '12,742 km',
    mass: '5.97 × 10²⁴ kg',
    temperature: '15°C (Trung bình: -88°C đến 58°C)',
    gravity: '9.81 m/s² (1.0g)',
    questionEn: 'What makes Earth unique among the known planets?',
    questionVi: 'Điều gì khiến Trái Đất trở nên độc nhất vô nhị trong số các hành tinh?',
    optionsEn: [
      'A. It is the largest planet.',
      'B. It has no atmosphere.',
      'C. It is the closest planet to the Sun.',
      'D. It is the only planet known to support life.'
    ],
    optionsVi: [
      'A. Là hành tinh có kích thước lớn nhất.',
      'B. Hoàn toàn không có bầu khí quyển.',
      'C. Là hành tinh ở gần Mặt Trời nhất.',
      'D. Là hành tinh duy nhất được biết đến có hỗ trợ sự sống.'
    ],
    answerIndex: 3,
    explanationEn: 'Earth resides in the habitable zone with liquid water, protective magnetosphere, and nitrogen-oxygen atmosphere.',
    explanationVi: 'Trái Đất nằm trong vùng có thể sống được (Goldilocks), sở hữu nước dạng lỏng, từ quyển và bầu khí quyển nuôi dưỡng sinh giới.',
    primaryColor: '#00b4d8'
  },
  moon: {
    id: 'moon',
    nameVi: 'Mặt Trăng',
    nameEn: 'The Moon',
    titleVi: 'Vệ tinh tự nhiên của Trái Đất',
    titleEn: "Earth's Natural Satellite",
    descVi: 'Vệ tinh tự nhiên duy nhất của Trái Đất. Bề mặt của nó phủ đầy đá, bụi và các miệng hố va chạm. Nó hầu như không có bầu khí quyển và trọng lực yếu hơn nhiều so với Trái Đất.',
    descEn: "Earth's only natural satellite. Its surface is covered with rocks, dust, and impact craters. It has almost no atmosphere and much weaker gravity than Earth.",
    diameter: '3,474 km',
    mass: '7.34 × 10²² kg',
    temperature: '-130°C (Đêm) đến 120°C (Ngày)',
    gravity: '1.62 m/s² (0.166g)',
    questionEn: 'Which statement best describes the Moon?',
    questionVi: 'Mô tả nào sau đây đúng nhất về Mặt Trăng?',
    optionsEn: [
      "A. It is Earth's natural satellite with a rocky, cratered surface.",
      'B. It is a planet made mainly of gas.',
      'C. It has a thicker atmosphere than Earth.',
      'D. It produces its own light like the Sun.'
    ],
    optionsVi: [
      'A. Là vệ tinh tự nhiên của Trái Đất với bề mặt nhiều đá và hố va chạm.',
      'B. Là một hành tinh cấu tạo chủ yếu bằng chất khí.',
      'C. Có bầu khí quyển dày đặc hơn Trái Đất.',
      'D. Tự phát ra ánh sáng như Mặt Trời.'
    ],
    answerIndex: 0,
    explanationEn: 'The Moon is tidally locked to Earth and features highlands, volcanic maria, and zero breathable atmosphere.',
    explanationVi: 'Mặt Trăng bị khóa thủy triều với Trái Đất, bề mặt gồm các biển dung nham bazan nguội và vô số hố thiên thạch cổ đại.',
    primaryColor: '#cbd5e1'
  },
  mars: {
    id: 'mars',
    nameVi: 'Sao Hỏa',
    nameEn: 'Mars',
    titleVi: 'Hành tinh Đỏ bí ẩn',
    titleEn: 'The Red Planet',
    descVi: 'Được mệnh danh là Hành tinh Đỏ do oxit sắt (gỉ sét) trên bề mặt. Nó có địa hình đá gồ ghề, các ngọn núi lửa khổng lồ, thung lũng sâu và nước đóng băng ở hai cực.',
    descEn: 'Known as the Red Planet because of iron oxide (rust) on its surface. It has rocky landscapes, giant volcanoes, deep valleys, and frozen water at its poles.',
    diameter: '6,779 km',
    mass: '6.42 × 10²³ kg',
    temperature: '-63°C (Trung bình: -140°C đến 20°C)',
    gravity: '3.71 m/s² (0.38g)',
    questionEn: 'Why is Mars often called the Red Planet?',
    questionVi: 'Tại sao Sao Hỏa thường được gọi là Hành tinh Đỏ?',
    optionsEn: [
      'A. Its atmosphere is made of red clouds.',
      'B. Its oceans reflect red sunlight.',
      'C. Iron oxide on its surface gives it a reddish color.',
      'D. It is covered with red plants.'
    ],
    optionsVi: [
      'A. Bầu khí quyển tạo bởi những đám mây đỏ.',
      'B. Các đại dương phản chiếu ánh sáng màu đỏ.',
      'C. Oxit sắt (gỉ sét) trên bề mặt tạo nên sắc đỏ đặc trưng.',
      'D. Bề mặt được bao phủ bởi thực vật màu đỏ.'
    ],
    answerIndex: 2,
    explanationEn: 'Iron oxide (rust) widespread in Martian rocks and soil gives the planet its iconic reddish rusty hue.',
    explanationVi: 'Khoáng chất oxit sắt phân bố khắp đất cát và bụi đá trên Sao Hỏa tạo nên sắc đỏ gỉ sét đặc trưng.',
    primaryColor: '#ef4444'
  },
  asteroids: {
    id: 'asteroids',
    nameVi: 'Vành đai Tiểu hành tinh',
    nameEn: 'Asteroids',
    titleVi: 'Vùng vật chất nguyên sơ',
    titleEn: 'Main Asteroid Belt Planetesimals',
    descVi: 'Những thiên thể nhỏ bằng đá hoặc kim loại quay quanh Mặt Trời. Phần lớn tập trung ở vành đai giữa Sao Hỏa và Sao Mộc. Chúng chứa vật chất còn sót lại từ thời sơ khai của Hệ Mặt Trời.',
    descEn: 'Small rocky or metallic objects that orbit the Sun. Many are found in the asteroid belt between Mars and Jupiter. Some contain materials left over from the early Solar System.',
    diameter: '1 m đến 940 km (Ceres)',
    mass: 'Khoảng 2.39 × 10²¹ kg (Tổng vành đai)',
    temperature: '-73°C đến -108°C',
    gravity: '0.001 – 0.27 m/s²',
    questionEn: 'Where is the main asteroid belt located?',
    questionVi: 'Vành đai tiểu hành tinh chính nằm ở vị trí nào?',
    optionsEn: [
      'A. Between Earth and the Moon.',
      'B. Between Mars and Jupiter.',
      'C. Between Uranus and Neptune.',
      'D. Inside the Sun.'
    ],
    optionsVi: [
      'A. Giữa Trái Đất và Mặt Trăng.',
      'B. Giữa quỹ đạo của Sao Hỏa và Sao Mộc.',
      'C. Giữa Sao Thiên Vương và Sao Hải Vương.',
      'D. Nằm bên trong lõi Mặt Trời.'
    ],
    answerIndex: 1,
    explanationEn: 'The asteroid belt lies between the orbits of Mars and Jupiter, where Jupiter gravity prevented a planet from coalescing.',
    explanationVi: 'Vành đai tiểu hành tinh nằm giữa Sao Hỏa và Sao Mộc, do lực hấp dẫn nhiễu loạn của Sao Mộc ngăn cản tạo thành một hành tinh hoàn chỉnh.',
    primaryColor: '#a8a29e'
  },
  jupiter: {
    id: 'jupiter',
    nameVi: 'Sao Mộc',
    nameEn: 'Jupiter',
    titleVi: 'Hành tinh khí khổng lồ lớn nhất',
    titleEn: 'Largest Gas Giant & King of Planets',
    descVi: 'Hành tinh lớn nhất trong Hệ Mặt Trời. Đây là một hành tinh khí khổng lồ với các dải mây rực rỡ và cơn bão khổng lồ Vết Đỏ Lớn đã tồn tại suốt nhiều thế kỷ.',
    descEn: 'The largest planet in the Solar System. It is a gas giant with colorful cloud bands and a massive storm called the Great Red Spot, which has lasted for centuries.',
    diameter: '139,820 km (11× Trái Đất)',
    mass: '1.898 × 10²⁷ kg (318× Trái Đất)',
    temperature: '-110°C (Tầng mây trên)',
    gravity: '24.79 m/s² (2.53g)',
    questionEn: "What is Jupiter's Great Red Spot?",
    questionVi: 'Vết Đỏ Lớn (Great Red Spot) trên Sao Mộc là gì?',
    optionsEn: [
      'A. A large rocky mountain.',
      'B. A huge ocean of red liquid.',
      'C. A giant impact crater.',
      'D. A massive storm that has lasted for centuries.'
    ],
    optionsVi: [
      'A. Một ngọn núi đá khổng lồ.',
      'B. Một đại dương chất lỏng màu đỏ mênh mông.',
      'C. Một miệng hố va chạm thiên thạch cực lớn.',
      'D. Một cơn bão xoáy khổng lồ đã kéo dài hàng thế kỷ.'
    ],
    answerIndex: 3,
    explanationEn: 'The Great Red Spot is a persistent anticyclonic storm larger than Earth with winds topping 430 km/h.',
    explanationVi: 'Vết Đỏ Lớn là một siêu bão nghịch quyển có đường kính lớn hơn cả Trái Đất, duy trì gió xoáy liên tục suốt hơn 300 năm.',
    primaryColor: '#f97316'
  },
  saturn: {
    id: 'saturn',
    nameVi: 'Sao Thổ',
    nameEn: 'Saturn',
    titleVi: 'Hành tinh khí với vành đai tráng lệ',
    titleEn: 'Ringed Jewel of the Solar System',
    descVi: 'Một hành tinh khí khổng lồ nổi tiếng với hệ thống vành đai tuyệt đẹp. Các vành đai này được tạo thành chủ yếu từ các hạt băng, cùng với một số vật liệu đá và bụi.',
    descEn: 'A gas giant famous for its large and beautiful ring system. The rings are made mostly of ice particles, along with some rocky material and dust.',
    diameter: '116,460 km (9.5× Trái Đất)',
    mass: '5.68 × 10²⁶ kg (95× Trái Đất)',
    temperature: '-140°C',
    gravity: '10.44 m/s² (1.06g)',
    questionEn: "What are Saturn's rings mostly made of?",
    questionVi: 'Vành đai của Sao Thổ cấu tạo chủ yếu từ vật chất gì?',
    optionsEn: [
      'A. Ice particles, with some rock and dust.',
      'B. Liquid water and oxygen.',
      'C. Hot lava and molten metal.',
      'D. Thick clouds of carbon dioxide.'
    ],
    optionsVi: [
      'A. Các mảnh băng nước, kèm theo bụi và đá vụn.',
      'B. Nước lỏng và khí oxy.',
      'C. Dung nham nóng chảy và kim loại lỏng.',
      'D. Những đám mây CO₂ đậm đặc.'
    ],
    answerIndex: 0,
    explanationEn: "Saturn's rings are over 99% pure water ice particles ranging in size from micrometers to meters.",
    explanationVi: 'Vành đai Sao Thổ gồm hơn 99% hạt băng nước tinh khiết từ kích thước hạt bụi vi mô đến tảng băng lớn hàng mét.',
    primaryColor: '#fde047'
  },
  uranus: {
    id: 'uranus',
    nameVi: 'Sao Thiên Vương',
    nameEn: 'Uranus',
    titleVi: 'Hành tinh băng nghiêng đặc biệt',
    titleEn: 'Tilted Aquamarine Ice Giant',
    descVi: 'Một hành tinh băng khổng lồ có màu xanh lam nhạt do khí metan trong bầu khí quyển. Nó rất khác thường vì tự quay gần như nằm ngang so với hầu hết các hành tinh khác.',
    descEn: 'An ice giant with a pale blue-green color caused by methane in its atmosphere. It is unusual because it rotates almost on its side, unlike most other planets.',
    diameter: '50,724 km',
    mass: '8.68 × 10²⁵ kg (14.5× Trái Đất)',
    temperature: '-195°C (Lạnh nhất trong các hành tinh)',
    gravity: '8.69 m/s² (0.89g)',
    questionEn: "What makes Uranus's rotation unusual?",
    questionVi: 'Điều gì khiến sự tự quay của Sao Thiên Vương trở nên khác thường?',
    optionsEn: [
      'A. It does not rotate at all.',
      'B. It rotates faster than every other planet.',
      'C. It rotates almost on its side.',
      'D. It rotates around Earth.'
    ],
    optionsVi: [
      'A. Nó hoàn toàn đứng yên không hề tự quay.',
      'B. Nó quay nhanh hơn bất kỳ hành tinh nào.',
      'C. Trục tự quay nghiêng tới 98°, gần như nằm ngang trên mặt phẳng quỹ đạo.',
      'D. Nó quay quanh Trái Đất.'
    ],
    answerIndex: 2,
    explanationEn: 'Uranus has an axial tilt of 97.77°, meaning its north and south poles lie where other planets have their equators.',
    explanationVi: 'Sao Thiên Vương có độ nghiêng trục lên tới 97.77°, khiến nó lăn tròn trên quỹ đạo thay vì quay thẳng đứng.',
    primaryColor: '#38bdf8'
  },
  neptune: {
    id: 'neptune',
    nameVi: 'Sao Hải Vương',
    nameEn: 'Neptune',
    titleVi: 'Hành tinh xa nhất với gió bão siêu thanh',
    titleEn: 'Outermost Wind-Swept Ice Giant',
    descVi: 'Hành tinh xa nhất tính từ Mặt Trời. Đây là một hành tinh băng khổng lồ màu xanh thẳm, lạnh giá với những cơn gió cực mạnh và các cơn bão dữ dội trong bầu khí quyển.',
    descEn: 'The farthest planet from the Sun. It is a cold, blue ice giant with extremely strong winds and powerful storms in its atmosphere.',
    diameter: '49,244 km',
    mass: '1.02 × 10²⁶ kg (17× Trái Đất)',
    temperature: '-201°C',
    gravity: '11.15 m/s² (1.14g)',
    questionEn: 'Which feature is Neptune especially known for?',
    questionVi: 'Đặc điểm nào khiến Sao Hải Vương nổi tiếng nhất?',
    optionsEn: [
      'A. Large liquid-water oceans.',
      'B. Extremely strong winds and powerful storms.',
      'C. A solid surface covered with forests.',
      'D. Being the closest planet to the Sun.'
    ],
    optionsVi: [
      'A. Những đại dương nước lỏng rộng lớn.',
      'B. Những luồng gió siêu bão dữ dội nhất trong Hệ Mặt Trời (tốc độ > 2,000 km/h).',
      'C. Bề mặt đất đá rắn bao phủ bởi rừng cây.',
      'D. Là hành tinh ở gần Mặt Trời nhất.'
    ],
    answerIndex: 1,
    explanationEn: 'Neptune boasts supersonic wind speeds exceeding 2,100 km/h, the fastest recorded anywhere in the Solar System.',
    explanationVi: 'Sao Hải Vương sở hữu những luồng gió bão siêu thanh đạt vận tốc kỷ lục hơn 2,100 km/h, dữ dội nhất trong Thái Dương Hệ.',
    primaryColor: '#2563eb'
  },
  halley: {
    id: 'halley',
    nameVi: 'Sao chổi Halley',
    nameEn: "Halley's Comet",
    titleVi: 'Thiên thể chu kỳ 76 năm',
    titleEn: 'Famous Periodic Comet (1P/Halley)',
    descVi: 'Một sao chổi nổi tiếng cấu tạo từ băng, bụi và vật liệu đá. Nó quay quanh Mặt Trời khoảng 76 năm một lần và phát triển phần đầu phát sáng rực rỡ cùng các đuôi khí khi tiến gần Mặt Trời.',
    descEn: 'A famous comet made of ice, dust, and rocky material. It orbits the Sun approximately once every 76 years and develops a bright coma and tails when it approaches the Sun.',
    diameter: '11 km (Hạt nhân)',
    mass: '2.2 × 10¹⁴ kg',
    temperature: '-200°C (Viễn điểm) đến 77°C (Cận điểm)',
    gravity: '0.001 m/s²',
    questionEn: "Approximately how long does Halley's Comet take to orbit the Sun?",
    questionVi: 'Sao chổi Halley mất khoảng bao nhiêu năm để hoàn thành một vòng quay quanh Mặt Trời?',
    optionsEn: [
      'A. 1 year.',
      'B. 12 years.',
      'C. 250 years.',
      'D. 76 years.'
    ],
    optionsVi: [
      'A. 1 năm.',
      'B. 12 năm.',
      'C. 250 năm.',
      'D. Khoảng 76 năm (75 – 76 năm).'
    ],
    answerIndex: 3,
    explanationEn: "1P/Halley is the only known short-period comet clearly visible to the naked eye, returning approximately every 75-76 years.",
    explanationVi: 'Sao chổi Halley là sao chổi chu kỳ ngắn duy nhất nhìn thấy được bằng mắt thường, xuất hiện trở lại định kỳ sau 75 - 76 năm.',
    primaryColor: '#00f0ff'
  },
  bennu: {
    id: 'bennu',
    nameEn: '101955 Bennu',
    nameVi: 'Tiểu Hành Tinh Bennu',
    subtitleEn: 'CARBONACEOUS ASTEROID (OSIRIS-REx & CSA TARGET)',
    subtitleVi: 'TIỂU HÀNH TINH CARBON NGUYÊN THỦY (MỤC TIÊU OSIRIS-REx & CSA)',
    shortDescEn: 'A carbonaceous rubble-pile asteroid and the target of NASA and the Canadian Space Agency\'s historic OSIRIS-REx sample return mission. Rich in ancient water-bearing minerals and prebiotic amino acids.',
    shortDescVi: 'Tiểu hành tinh carbon dạng đống đá xốp và là mục tiêu của sứ mệnh lịch sử OSIRIS-REx (NASA phối hợp cùng CSA Canada). Rất giàu khoáng vật ngậm nước cổ đại và các phân tử tiền sinh học hơn 4.5 tỷ năm tuổi.',
    diameter: '492 m',
    mass: '7.329 × 10¹⁰ kg',
    temperature: '-73°C đến +7°C',
    gravity: '0.0001 m/s²',
    questionEn: 'Which Canadian Space Agency instrument on OSIRIS-REx scanned Bennu to create high-resolution 3D topography maps for landing site selection?',
    questionVi: 'Thiết bị nào của Cơ quan Vũ trụ Canada (CSA) trên tàu OSIRIS-REx đã quét 3D Bennu để chọn bãi đáp hạ cánh an toàn?',
    optionsEn: [
      'A. OLA (OSIRIS-REx Laser Altimeter)',
      'B. Canadarm2 Robotic Arm',
      'C. Dextre Special Purpose Manipulator',
      'D. James Webb NIRISS Spectrograph'
    ],
    optionsVi: [
      'A. OLA (Máy đo độ cao laser OSIRIS-REx Laser Altimeter)',
      'B. Cánh tay robot trạm vũ trụ Canadarm2',
      'C. Cánh tay robot bảo dưỡng Dextre',
      'D. Máy quang phổ hồng ngoại NIRISS'
    ],
    answerIndex: 0,
    explanationEn: 'The Canadian Space Agency contributed the OSIRIS-REx Laser Altimeter (OLA), which fired billions of laser pulses to create the highest-resolution 3D topographical map of any celestial body in space exploration history.',
    explanationVi: 'Cơ quan Vũ trụ Canada (CSA) đã chế tạo và đóng góp thiết bị đo độ cao Laser OLA, phát hàng tỷ chùm laser để lập bản đồ 3D địa hình chi tiết nhất lịch sử thiên văn, giúp chọn bãi đáp Nightingale an toàn.',
    primaryColor: '#38bdf8'
  }
};

export interface GeologicalSample {
  id: string;
  nameVi: string;
  nameEn: string;
  typeVi: string;
  typeEn: string;
  descVi: string;
  descEn: string;
  massGrams: number;
  color: string;
  icon: string;
}

export const GEOLOGICAL_SAMPLES_BY_BODY: Record<string, GeologicalSample[]> = {
  earth: [
    {
      id: 'earth_granite',
      nameVi: 'Đá Granite (Hoa Cương)',
      nameEn: 'Granite Rock',
      typeVi: 'Đá Magma Xâm Nhập',
      typeEn: 'Plutonic Igneous Rock',
      descVi: 'Đá magma hình thành khi magma nguội chậm dưới lòng đất. Thường có các hạt khoáng vật màu trắng, xám, hồng và đen. Giúp hiểu cách đá hình thành bên trong Trái Đất.',
      descEn: 'Igneous rock formed when magma cools slowly deep underground. Contains visible quartz, feldspar, and mica grains. Explains internal planetary crust crystallization.',
      massGrams: 285,
      color: '#d8b4a0',
      icon: '🪨'
    },
    {
      id: 'earth_basalt',
      nameVi: 'Đá Bazan (Huyền Vũ)',
      nameEn: 'Basalt Rock',
      typeVi: 'Đá Núi Lửa Phun Trào',
      typeEn: 'Extrusive Volcanic Rock',
      descVi: 'Đá núi lửa màu tối, hình thành khi dung nham nguội và đông cứng nhanh trên bề mặt. Giúp tìm hiểu các đợt hoạt động núi lửa kiến tạo mảng.',
      descEn: 'Dark volcanic rock formed when basaltic lava cools rapidly on the crustal surface. Demonstrates dynamic volcanism and oceanic crust formation.',
      massGrams: 310,
      color: '#475569',
      icon: '🌋'
    },
    {
      id: 'earth_sandstone',
      nameVi: 'Đá Sa Thạch',
      nameEn: 'Sandstone Rock',
      typeVi: 'Đá Trầm Tích Vụn',
      typeEn: 'Clastic Sedimentary Rock',
      descVi: 'Đá trầm tích hình thành khi các hạt cát tích tụ, bị nén và gắn kết qua thời gian địa chất. Cho thấy gió và nước vận chuyển vật liệu để tạo thành đá.',
      descEn: 'Sedimentary rock formed by mineral sand grains compacted and cemented over millions of years, recording ancient fluid and wind transport cycles.',
      massGrams: 195,
      color: '#ca8a04',
      icon: '🏜️'
    }
  ],
  moon: [
    {
      id: 'moon_rock',
      nameVi: 'Đá Mặt Trăng (Anorthosite)',
      nameEn: 'Lunar Highlands Rock',
      typeVi: 'Đá Thạch Anh Mặt Trăng',
      typeEn: 'Pristine Anorthosite Crust',
      descVi: 'Đá Mặt Trăng giúp các nhà khoa học tìm hiểu lịch sử núi lửa cổ đại, các vụ va chạm thiên thạch quy mô lớn và quá trình hình thành Mặt Trăng.',
      descEn: 'Primitive lunar crustal rock that helps scientists decode ancient magma oceans, giant impacts, and the Giant Impactor (Theia) origin model.',
      massGrams: 180,
      color: '#94a3b8',
      icon: '🌕'
    },
    {
      id: 'moon_ice',
      nameVi: 'Băng Nước Vùng Cực',
      nameEn: 'Lunar Polar Water Ice',
      typeVi: 'Tài Nguyên Dễ Bay Hơi',
      typeEn: 'Cryogenic Volatile Ice',
      descVi: 'Băng nước được phát hiện tại các hố va chạm luôn nằm trong bóng tối vĩnh cửu gần hai cực Mặt Trăng. Đây là nguồn tài nguyên sống còn cho các căn cứ vũ trụ tương lai.',
      descEn: 'Water ice trapped in permanently shadowed craters at the lunar poles. Essential rocket fuel and life-support propellant for the Artemis generation.',
      massGrams: 240,
      color: '#38bdf8',
      icon: '🧊'
    },
    {
      id: 'moon_regolith',
      nameVi: 'Đất Đá Vụn (Lunar Regolith)',
      nameEn: 'Lunar Regolith Dust',
      typeVi: 'Bụi Va Chạm Vi Thiên Thạch',
      typeEn: 'Impact Shock Breccia Dust',
      descVi: 'Lớp bụi và mảnh đá vụn sắc nhọn bao phủ toàn bộ bề mặt Mặt Trăng, hình thành từ hàng tỷ năm bị thiên thạch bắn phá liên tục.',
      descEn: 'Fine, razor-sharp pulverized glass and rock fragments blanketing the lunar surface, pulverized by billions of years of micrometeorite bombardment.',
      massGrams: 150,
      color: '#64748b',
      icon: '☄️'
    }
  ],
  mars: [
    {
      id: 'mars_rock',
      nameVi: 'Đá Sao Hỏa (Oxit Sắt)',
      nameEn: 'Martian Basaltic Rock',
      typeVi: 'Đá Bazan Sao Hỏa Chứa Sắt',
      typeEn: 'Ferric Volcanic Specimen',
      descVi: 'Đá Sao Hỏa giúp tìm hiểu lịch sử hoạt động núi lửa cổ đại, sự hình thành các thung lũng khổng lồ và dấu vết của môi trường từng có nước dạng lỏng trong quá khứ.',
      descEn: 'Iron-rich volcanic rock revealing ancient hydrological systems, hydrothermal mineral alteration, and past habitable Martian environments.',
      massGrams: 220,
      color: '#ef4444',
      icon: '🔴'
    },
    {
      id: 'mars_gas',
      nameVi: 'Mẫu Khí Quyển Sao Hỏa',
      nameEn: 'Atmospheric Gas Sample',
      typeVi: 'Khí Quyển Loãng (95% CO₂)',
      typeEn: 'Hermetic Rarefied Gas',
      descVi: 'Khí quyển Sao Hỏa rất loãng (áp suất chỉ bằng 0.6% Trái Đất) và chủ yếu là carbon dioxide (CO₂). Mẫu khí giúp hiểu vì sao Sao Hỏa mất nước và trở nên băng giá.',
      descEn: 'Ultra-thin CO2 atmosphere (pressure ~6 mbar). Gas spectrometry illuminates how solar wind stripped the early dense Martian greenhouse shield.',
      massGrams: 65,
      color: '#f97316',
      icon: '💨'
    }
  ],
  bennu: [
    {
      id: 'bennu_regolith',
      nameVi: 'Bụi Mẫu Tiểu Hành Tinh Bennu (TAGSAM Regolith)',
      nameEn: 'Bennu Carbonaceous Regolith',
      typeVi: 'Trầm Tích Hữu Cơ Nguyên Thủy (C > 4%)',
      typeEn: 'Primitive Carbonaceous Regolith',
      descVi: 'Mẫu vật tối màu giàu carbon và khoáng vật đất sét ngậm nước cổ xưa hơn 4.5 tỷ năm tuổi, thu thập bởi cánh tay TAGSAM của tàu OSIRIS-REx.',
      descEn: 'Pristine, dark carbon-rich grains and hydrated phyllosilicates dating back 4.5 billion years to the dawn of our Solar System.',
      massGrams: 121.6,
      color: '#38bdf8',
      icon: '☄️'
    },
    {
      id: 'bennu_magnetite',
      nameVi: 'Khoáng Vật Thủy Nhiệt Bennu Magnetite',
      nameEn: 'Hydrothermal Magnetite Nodules',
      typeVi: 'Khoáng Vật Kết Tinh Từ Nước Cổ',
      typeEn: 'Aqueous Alteration Mineral',
      descVi: 'Bằng chứng then chốt chứng minh nước lỏng từng chảy dồi dào bên trong lòng thiên thể mẹ của Bennu trước khi bị va chạm vỡ vụn.',
      descEn: 'Conclusive geochemical proof that liquid water once flowed through extensive hydrothermal veins inside Bennu\'s parent asteroid.',
      massGrams: 64.2,
      color: '#f59e0b',
      icon: '🪨'
    },
    {
      id: 'bennu_breccia',
      nameVi: 'Mảnh Đá Dăm Bennu Breccia Tiền Sinh Học',
      nameEn: 'Bennu Prebiotic Breccia Clast',
      typeVi: 'Đá Dăm Va Chạm Chứa Axit Amin',
      typeEn: 'Organic Impact Breccia',
      descVi: 'Khối đá xốp tổng hợp từ các mảnh vụn va chạm vi thiên thạch, lưu giữ các phân tử axit amin và tiền chất cấu tạo nên sự sống.',
      descEn: 'Porous aggregate clast containing extra-terrestrial amino acids and nucleobases vital for understanding the chemical origins of life.',
      massGrams: 85.0,
      color: '#a855f7',
      icon: '💎'
    }
  ],
  asteroids: [
    {
      id: 'asteroid_chondrite',
      nameVi: 'Mảnh Thiên Thạch Chondrite Carbon',
      nameEn: 'Carbonaceous Chondrite Fragment',
      typeVi: 'Vật Chất Thái Dương Hệ Nguyên Thủy',
      typeEn: 'Undifferentiated Primitive Chondrite',
      descVi: 'Vật chất không bị phân tầng nhiệt, lưu giữ gần như nguyên vẹn thành phần hóa học của đĩa tiền hành tinh thuở sơ khai.',
      descEn: 'Undifferentiated chondrule-bearing matter preserving primordial Solar System chemistry unaffected by planetary melting.',
      massGrams: 110,
      color: '#94a3b8',
      icon: '☄️'
    }
  ]
};

/**
 * Danh sách Bãi Đáp Khảo Sát (OSIRIS-REx Candidate Landing Sites)
 * Tái hiện chính xác cơ chế của game Canadian Space Agency (CSA) OSIRIS-REx!
 */
export interface LandingSite {
  id: string;
  nameVi: string;
  nameEn: string;
  hazardVi: string;
  hazardEn: string;
  sampleAbundanceVi: string;
  sampleAbundanceEn: string;
  boulderDensity: number; // 0.0 -> 1.0
  surfaceColor: string;
  craterRadius: number;
}

export const LANDING_SITES_BY_BODY: Record<string, LandingSite[]> = {
  bennu: [
    {
      id: 'nightingale',
      nameVi: 'Miệng Hố Nightingale (Bãi Đáp Số 1 CSA/NASA)',
      nameEn: 'Nightingale Crater (Primary Site)',
      hazardVi: 'Hiểm họa tảng đá: Thấp (Lòng chảo hạt mịn)',
      hazardEn: 'Boulder Hazard: Low • Fine Grain Crater',
      sampleAbundanceVi: 'Mật độ mẫu: Cực cao (Giàu hữu cơ & nước)',
      sampleAbundanceEn: 'Sample Abundance: Very High (Pristine)',
      boulderDensity: 0.22,
      surfaceColor: '#1f2530',
      craterRadius: 28
    },
    {
      id: 'osprey',
      nameVi: 'Miệng Hố Osprey (Bãi Đáp Dự Phòng)',
      nameEn: 'Osprey Crater (Backup Site)',
      hazardVi: 'Hiểm họa tảng đá: Trung bình (Vành dốc)',
      hazardEn: 'Boulder Hazard: Medium • Sloped Rim',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Khoáng vật ngậm nước)',
      sampleAbundanceEn: 'Sample Abundance: High (Hydrated)',
      boulderDensity: 0.42,
      surfaceColor: '#252c38',
      craterRadius: 20
    },
    {
      id: 'kingfisher',
      nameVi: 'Miệng Hố Kingfisher (Vùng Lòng Chảo)',
      nameEn: 'Kingfisher Crater',
      hazardVi: 'Hiểm họa tảng đá: Cao (Nhiều khối đá dăm)',
      hazardEn: 'Boulder Hazard: High • Multiple Boulders',
      sampleAbundanceVi: 'Mật độ mẫu: Trung bình',
      sampleAbundanceEn: 'Sample Abundance: Medium',
      boulderDensity: 0.65,
      surfaceColor: '#1a1f29',
      craterRadius: 18
    },
    {
      id: 'sandpiper',
      nameVi: 'Miệng Hố Sandpiper (Vùng Đá Gồ Ghề)',
      nameEn: 'Sandpiper Crater',
      hazardVi: 'Hiểm họa tảng đá: Rất cao (Tảng đá > 10m)',
      hazardEn: 'Boulder Hazard: Very High • 10m Boulders',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Vật chất tiền sinh học)',
      sampleAbundanceEn: 'Sample Abundance: High (Prebiotic)',
      boulderDensity: 0.80,
      surfaceColor: '#161a22',
      craterRadius: 16
    }
  ],
  moon: [
    {
      id: 'tranquillitatis',
      nameVi: 'Biển Bình Yên (Mare Tranquillitatis - Apollo 11)',
      nameEn: 'Mare Tranquillitatis (Apollo 11 Base)',
      hazardVi: 'Hiểm họa: Thấp (Bình nguyên dung nham phẳng)',
      hazardEn: 'Hazard: Low • Smooth Basalt Plain',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Đá bazan titan)',
      sampleAbundanceEn: 'Sample Abundance: High (Titanium Basalt)',
      boulderDensity: 0.25,
      surfaceColor: '#363940',
      craterRadius: 32
    },
    {
      id: 'shackleton',
      nameVi: 'Miệng Hố Shackleton (Cực Nam Băng Giá)',
      nameEn: 'Shackleton Crater (Lunar South Pole)',
      hazardVi: 'Hiểm họa: Cao (Vùng bóng tối vĩnh cửu & vách dốc)',
      hazardEn: 'Hazard: High • Permanently Shadowed Rim',
      sampleAbundanceVi: 'Mật độ mẫu: Cực cao (Băng nước tinh khiết)',
      sampleAbundanceEn: 'Sample Abundance: Extreme (Pure Water Ice)',
      boulderDensity: 0.60,
      surfaceColor: '#1c202a',
      craterRadius: 22
    },
    {
      id: 'procellarum',
      nameVi: 'Đại Dương Bão Tố (Oceanus Procellarum)',
      nameEn: 'Oceanus Procellarum',
      hazardVi: 'Hiểm họa: Trung bình (Đất vụn Regolith dày)',
      hazardEn: 'Hazard: Medium • Deep Regolith Layer',
      sampleAbundanceVi: 'Mật độ mẫu: Rất cao (Khoáng KREEP)',
      sampleAbundanceEn: 'Sample Abundance: High (KREEP Basalt)',
      boulderDensity: 0.38,
      surfaceColor: '#3e424c',
      craterRadius: 26
    }
  ],
  mars: [
    {
      id: 'jezero',
      nameVi: 'Châu Thổ Miệng Hố Jezero (Perseverance Rover)',
      nameEn: 'Jezero Crater Paleolake Delta',
      hazardVi: 'Hiểm họa: Trung bình (Trầm tích lòng hồ cổ)',
      hazardEn: 'Hazard: Medium • Ancient Lakebed Strata',
      sampleAbundanceVi: 'Mật độ mẫu: Cực cao (Dấu vết sinh học cổ)',
      sampleAbundanceEn: 'Sample Abundance: Extreme (Fossil Biosignatures)',
      boulderDensity: 0.35,
      surfaceColor: '#8c381f',
      craterRadius: 28
    },
    {
      id: 'gale',
      nameVi: 'Miệng Hố Gale (Chân Núi Mount Sharp)',
      nameEn: 'Gale Crater (Mount Sharp Aeolis)',
      hazardVi: 'Hiểm họa: Cao (Cồn cát sắc nhọn & gờ đá dốc)',
      hazardEn: 'Hazard: High • Sharp Dunes & Rock Scarps',
      sampleAbundanceVi: 'Mật độ mẫu: Rất cao (Khoáng đất sét & Sulfate)',
      sampleAbundanceEn: 'Sample Abundance: Very High (Clay & Sulfate)',
      boulderDensity: 0.58,
      surfaceColor: '#7a2f18',
      craterRadius: 24
    },
    {
      id: 'marineris',
      nameVi: 'Hẻm Vực Khổng Lồ Valles Marineris',
      nameEn: 'Valles Marineris Rift Valley',
      hazardVi: 'Hiểm họa: Rất cao (Vách vực thẳng đứng 7,000m)',
      hazardEn: 'Hazard: Very High • 7,000m Canyon Abyss',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Lát cắt thạch quyển sâu)',
      sampleAbundanceEn: 'Sample Abundance: High (Deep Mantle Outcrop)',
      boulderDensity: 0.72,
      surfaceColor: '#68230f',
      craterRadius: 20
    }
  ],
  earth: [
    {
      id: 'continental_station',
      nameVi: 'Trạm Địa Chất Khiên Lục Địa Cổ (Canadian Shield)',
      nameEn: 'Ancient Continental Shield Station',
      hazardVi: 'Hiểm họa: Thấp (Nền đá hoa cương cứng vững)',
      hazardEn: 'Hazard: Low • Stable Craton Bedrock',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Đá Granit & Magma xâm nhập)',
      sampleAbundanceEn: 'Sample Abundance: High (Granite Pluton)',
      boulderDensity: 0.18,
      surfaceColor: '#2b382d',
      craterRadius: 35
    },
    {
      id: 'volcanic_plateau',
      nameVi: 'Cao Nguyên Núi Lửa Bazan (Lava Field)',
      nameEn: 'Basaltic Volcanic Plateau',
      hazardVi: 'Hiểm họa: Trung bình (Dòng dung nham nguội gồ ghề)',
      hazardEn: 'Hazard: Medium • Solidified Lava Flow',
      sampleAbundanceVi: 'Mật độ mẫu: Cao (Bazan giàu Olivine & Sắt)',
      sampleAbundanceEn: 'Sample Abundance: High (Olivine Basalt)',
      boulderDensity: 0.48,
      surfaceColor: '#202521',
      craterRadius: 25
    }
  ]
};

/**
 * Bảng Chi Phí Di Chuyển (Travel Budget Costs in $M)
 */
export const TRAVEL_COST_MISSION_1: Record<string, number> = {
  moon: 5,
  earth: 5,
  venus: 8,
  mars: 9,
  mercury: 10,
  bennu: 12,
  asteroids: 13,
  phas: 13,
  ceres: 13,
  jupiter: 17,
  saturn: 23,
  halley: 30,
  uranus: 31,
  neptune: 37,
  sun: 15
};

export const TRAVEL_COST_MISSION_2: Record<string, number> = {
  earth: 5,
  moon: 28,
  bennu: 32,
  mars: 44,
  asteroids: 45,
  mercury: 55, // Quá nóng - Cảnh báo không thể hạ cánh
  venus: 62,   // Áp suất nghiền nát & nóng 465°C - Cảnh báo không thể hạ cánh
  halley: 85
};

/**
 * Danh sách phi thuyền đủ điều kiện hạ cánh cho Nhiệm vụ 2 (Mission 2: Sample Return)
 */
export const LANDING_CAPABLE_SHIPS_M2: string[] = [
  'apollo_lm', // NASA Apollo 11 Lunar Module
  'shuttle',   // NASA Space Shuttle Orbiter (Discovery OV-103)
  'quinjet',   // Quinjet Mk-VII (Stealth Concept)
  'milano'     // The Milano (Light Scout)
];

/**
 * Thiên thể có bề mặt rắn phù hợp để đáp đất lấy mẫu (Mission 2)
 */
export const LANDABLE_BODIES_M2: string[] = ['earth', 'moon', 'mars', 'bennu', 'asteroids'];

export function getTravelCost(missionId: string, targetBodyId: string): number {
  const normId = targetBodyId.toLowerCase();
  if (missionId === 'mission_2_samples') {
    return TRAVEL_COST_MISSION_2[normId] || 45;
  }
  return TRAVEL_COST_MISSION_1[normId] || 15;
}
