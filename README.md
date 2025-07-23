# Network+ Quiz App

This repository hosts a mobile application designed to help users learn and test their knowledge of Network+ concepts. It's built with React Native, and I've set up an automated build and deployment pipeline using GitHub Actions and Expo's EAS Build.

---

## English Version

### ✨ Features

* **Multiple Choice Questions:** Dive into a collection of questions covering various Network+ topics.
* **Instant Feedback:** Get immediate feedback on your answers, knowing right away if you're on the right track.
* **Scoring System:** See how well you're doing with a score calculated at the end of each quiz session.
* **Simple & Intuitive UI:** The app is designed to be straightforward and easy to navigate, focusing on a smooth learning experience.
* **Cross-Platform Support:** Thanks to React Native, this app runs seamlessly on both Android and iOS devices.

### 🚀 Technologies Used

* **React Native:** The framework I used for building this cross-platform mobile application.
* **Expo:** A fantastic set of tools and a framework that made React Native development much faster and more enjoyable.
* **EAS Build:** Expo's cloud service that handles the heavy lifting of building and signing the app packages (APK/AAB) for me.
* **JavaScript:** The primary language powering the entire application logic.
* **GitHub Actions:** My chosen CI/CD platform to automate the entire build and deployment process, making sure every push to the main branch gets a fresh build.

### 🛠️ Setup & Local Development

Want to run this project on your machine? Here's how:

1.  **Install Node.js and npm:**
    Make sure you have Node.js (version 18 or higher is recommended) and npm installed. They usually come together.

2.  **Install Expo CLI:**
    ```bash
    npm install -g expo-cli
    ```

3.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sadrabn47/Network_Plus_Quiz_App_Android.git](https://github.com/sadrabn47/Network_Plus_Quiz_App_Android.git)
    cd Network_Plus_Quiz_App_Android
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

5.  **Run the application:**
    ```bash
    expo start
    ```
    After running this command, you'll see a QR Code in your terminal. Just scan it with the Expo Go app on your phone, or use an Android/iOS emulator to run the app.

### 📱 Screenshots

(Here, you can add a few screenshots of your app. I recommend placing your image files in a folder like `assets/screenshots` within your project and then linking them here. Example: `![Main Screen](assets/screenshots/main-screen.png)`)

![Main Screen Image](https://placehold.co/400x600/aabbcc/ffffff?text=Main+Screen)
![Quiz Screen Image](https://placehold.co/400x600/ccbbaa/ffffff?text=Quiz+Screen)
![Results Screen Image](https://placehold.co/400x600/bbaacc/ffffff?text=Results+Screen)

### ⬇️ Download & Installation

You can grab the latest Android APK version of the app directly from the link below and install it on your Android device:

**APK Download Link (from EAS Build):** [https://expo.dev/artifacts/eas/avpHrUbjKtXLk7h47tvAJQ.apk](https://expo.dev/artifacts/eas/avpHrUbjKtXLk7h47tvAJQ.apk)

**Alternative Download Link (Google Drive):** [https://drive.google.com/file/d/1yDyOchcWOI-PTO5bBz7Ei2NnnwFLuxSD/view?usp=drive_link](https://drive.google.com/file/d/1yDyOchcWOI-PTO5bBz7Ei2NnnwFLuxSD/view?usp=drive_link)

**Note:** If you face any issues downloading the file from the EAS Build link (sometimes due to regional access restrictions), the Google Drive link should work as an alternative.

### ⚙️ CI/CD Automation with GitHub Actions

One of the cool things about this project is its automated build process. I've set up GitHub Actions to handle continuous integration and continuous delivery. Whenever I push changes to the `master` branch, GitHub Actions automatically kicks off these steps:

1.  **Checkout Repository:** Fetches the latest code.
2.  **Environment Setup:** Prepares the build environment by installing Node.js, Expo CLI, and EAS CLI.
3.  **Install Dependencies:** Installs all necessary project packages.
4.  **Build Application:** Uses EAS Build to generate the Android APK (or AAB) file.

This automation significantly speeds up development and ensures reliable deployments. You can check out the Workflow file itself right here: [.github/workflows/main.yml](.github/workflows/main.yml).

### 🤝 Contributing

(Optional: If you're open to contributions, you can add a small section here explaining how others can contribute to your project.)

### 📄 License

(Optional: If your project has a specific license, you can mention it here, e.g., MIT License.)

---

## نسخه فارسی

### ✨ ویژگی‌ها

* **سوالات چند گزینه‌ای:** مجموعه‌ای از سوالات مربوط به مفاهیم Network+ را در اختیار شما قرار می‌دهد.
* **بازخورد فوری:** بلافاصله پس از انتخاب هر پاسخ، متوجه می‌شوید که جواب درست بوده یا خیر.
* **سیستم امتیازدهی:** در پایان هر آزمون، امتیاز شما محاسبه و نمایش داده می‌شود تا عملکردتان را ارزیابی کنید.
* **رابط کاربری ساده و بصری:** طراحی اپلیکیشن به گونه‌ای است که استفاده از آن آسان و تجربه یادگیری را دلپذیر می‌کند.
* **پشتیبانی چند پلتفرمی:** به لطف React Native، این اپلیکیشن به راحتی روی دستگاه‌های اندروید و iOS قابل اجراست.

### 🚀 تکنولوژی‌های استفاده شده

* **React Native:** فریم‌ورکی که برای توسعه این اپلیکیشن موبایل چند پلتفرمی از آن استفاده کرده‌ام.
* **Expo:** مجموعه‌ای از ابزارها و یک فریم‌ورک که توسعه React Native را برایم بسیار سریع‌تر و راحت‌تر کرد.
* **EAS Build:** سرویس ابری Expo که وظیفه سنگین ساخت و امضای خودکار پکیج‌های اپلیکیشن (APK/AAB) را بر عهده دارد.
* **JavaScript:** زبان برنامه‌نویسی اصلی که منطق کل اپلیکیشن را پیاده‌سازی کرده‌ام.
* **GitHub Actions:** پلتفرم CI/CD انتخابی من برای خودکارسازی کل فرآیند ساخت و استقرار، که تضمین می‌کند هر بار که تغییری به شاخه اصلی (master) پوش می‌شود، یک بیلد جدید ساخته شود.

### 🛠️ راهنمای راه‌اندازی و توسعه محلی

اگر می‌خواهید این پروژه را روی سیستم خودتان اجرا کنید، مراحل زیر را دنبال کنید:

1.  **نصب Node.js و npm:**
    اطمینان حاصل کنید که Node.js (نسخه ۱۸ یا بالاتر توصیه می‌شود) و npm (که همراه Node.js نصب می‌شود) روی سیستم شما نصب هستند.

2.  **نصب Expo CLI:**
    ```bash
    npm install -g expo-cli
    ```

3.  **کلون کردن مخزن:**
    ```bash
    git clone [https://github.com/sadrabn47/Network_Plus_Quiz_App_Android.git](https://github.com/sadrabn47/Network_Plus_Quiz_App_Android.git)
    cd Network_Plus_Quiz_App_Android
    ```

4.  **نصب وابستگی‌ها:**
    ```bash
    npm install
    ```

5.  **اجرای اپلیکیشن:**
    ```bash
    expo start
    ```
    پس از اجرای این دستور، یک کد QR در ترمینال نمایش داده می‌شود. می‌توانید آن را با اپلیکیشن Expo Go روی گوشی خود اسکن کنید یا از شبیه‌ساز (Emulator) اندروید/iOS استفاده کنید.

### 📱 اسکرین‌شات‌ها

(در اینجا می‌توانید چند اسکرین‌شات از اپلیکیشن خود قرار دهید. توصیه می‌کنم فایل‌های تصویری خود را در پوشه‌ای مانند `assets/screenshots` در داخل پروژه قرار دهید و سپس لینک آن‌ها را اینجا بگذارید. مثال: `![صفحه اصلی](assets/screenshots/main-screen.png)`)

![تصویر صفحه اصلی](https://placehold.co/400x600/aabbcc/ffffff?text=صفحه+اصلی)
![تصویر صفحه سوالات](https://placehold.co/400x600/ccbbaa/ffffff?text=صفحه+سوالات)
![تصویر صفحه نتایج](https://placehold.co/400x600/bbaacc/ffffff?text=صفحه+نتایج)

### ⬇️ دانلود و نصب

می‌توانید آخرین نسخه APK اپلیکیشن اندروید را مستقیماً از لینک زیر دانلود کرده و روی دستگاه اندرویدی خود نصب کنید:

**لینک دانلود APK (از EAS Build):** [https://expo.dev/artifacts/eas/avpHrUbjKtXLk7h47tvAJQ.apk](https://expo.dev/artifacts/eas/avpHrUbjKtXLk7h47tvAJQ.apk)

**لینک دانلود جایگزین (گوگل درایو):** [https://drive.google.com/file/d/1yDyOchcWOI-PTO5bBz7Ei2NnnwFLuxSD/view?usp=drive_link](https://drive.google.com/file/d/1yDyOchcWOI-PTO5bBz7Ei2NnnwFLuxSD/view?usp=drive_link)

**نکته:** اگر در دانلود فایل از لینک EAS Build با مشکل مواجه شدید (گاهی اوقات به دلیل محدودیت‌های دسترسی منطقه‌ای)، لینک گوگل درایو می‌تواند به عنوان یک جایگزین عمل کند.

### ⚙️ اتوماسیون CI/CD با GitHub Actions

یکی از جنبه‌های جالب این پروژه، فرآیند ساخت خودکار اپلیکیشن است. من از GitHub Actions برای مدیریت یکپارچه‌سازی پیوسته و تحویل پیوسته (CI/CD) استفاده کرده‌ام. هر زمان که تغییراتی به شاخه `master` پوش می‌شود، GitHub Actions به طور خودکار مراحل زیر را آغاز می‌کند:

1.  **Checkout کردن کد:** آخرین نسخه کد را از مخزن دریافت می‌کند.
2.  **تنظیم محیط:** محیط ساخت را با نصب Node.js، Expo CLI و EAS CLI آماده می‌کند.
3.  **نصب وابستگی‌ها:** تمام پکیج‌های مورد نیاز پروژه را نصب می‌کند.
4.  **ساخت اپلیکیشن:** از EAS Build برای تولید فایل APK (یا AAB) اندروید استفاده می‌کند.

این اتوماسیون به طور قابل توجهی سرعت توسعه و قابلیت اطمینان استقرار اپلیکیشن را افزایش می‌دهد. می‌توانید فایل Workflow مربوطه را از اینجا مشاهده کنید: [.github/workflows/main.yml](.github/workflows/main.yml).

### 🤝 مشارکت

(اختیاری: اگر مایلید دیگران در پروژه شما مشارکت کنند، می‌توانید در این بخش دستورالعمل‌هایی را برای مشارکت‌کنندگان اضافه کنید.)

### 📄 لایسنس

(اختیاری: اگر پروژه شما دارای لایسنس خاصی است، می‌توانید نام آن را در اینجا ذکر کنید، مثلاً MIT License.)
