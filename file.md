# Hướng Dẫn Cấu Trúc File & Sơ Đồ Hệ Thống

Tài liệu này cung cấp cái nhìn toàn diện về cấu trúc thư mục, chức năng chi tiết của từng file, và cách các thành phần liên kết với nhau trong ứng dụng thuê váy dạ hội cao cấp của bạn.

---

## 📂 Sơ Đồ Cây Thư Mục Tổng (Project Directory Tree)

```text
.
├── .env.example              # Mẫu khai báo các biến môi trường
├── .gitignore                # Khai báo các file/thư mục Git sẽ bỏ qua (như node_modules)
├── index.html                # File HTML chính, điểm neo (root) gắn ứng dụng React
├── metadata.json             # Metadata chuẩn của AI Studio (Cấp quyền, tên, mô tả ứng dụng)
├── package.json              # Quản lý thư viện phụ thuộc (dependencies) và kịch bản khởi chạy
├── tsconfig.json             # Cấu hình trình biên dịch TypeScript
├── vite.config.ts            # Cấu hình môi trường phát triển và Build của Vite
└── src/                      # Thư mục mã nguồn chính của ứng dụng
    ├── App.tsx               # Component gốc xử lý Điều hướng chính (Routing) và Bố cục (Layout)
    ├── index.css             # Điểm cấu hình Tailwind CSS toàn cục và Font chữ (Inter, Space Grotesk)
    ├── main.tsx              # Điểm khởi chạy chính (entrypoint) của React để render lên DOM
    ├── mockData.ts           # Cơ sở dữ liệu mẫu ban đầu (Váy dạ hội, Danh mục, Người dùng, Đơn hàng)
    ├── types.ts              # Khai báo tất cả Type/Interface TypeScript dùng chung trong ứng dụng
    ├── components/           # Các thành phần giao diện tái sử dụng
    │   ├── AdminDashboard.tsx# Giao diện Quản trị viên (Quản lý váy, Đơn hàng, Doanh thu, Flash Sale...)
    │   ├── ChatWidget.tsx    # Hộp thoại chat hỗ trợ khách hàng tích hợp tiện lợi
    │   ├── LanguageToggle.tsx# Nút chuyển đổi nhanh ngôn ngữ hiển thị (Việt - Anh)
    │   └── StoreFront.tsx    # Giao diện cửa hàng chính cho khách hàng duyệt váy, lọc giá, booking
    ├── contexts/             # Quản lý trạng thái toàn cục bằng React Context API
    │   ├── AuthContext.tsx   # Quản lý tài khoản đăng nhập (Khách hàng, Admin) và Lưu phiên làm việc
    │   ├── CartContext.tsx   # Quản lý giỏ hàng thuê váy, tính toán chi phí đặt giữ chỗ tạm tính
    │   ├── LanguageContext.tsx# Công cụ Đa ngôn ngữ (Hỗ trợ nhãn tiếng Việt & tiếng Anh)
    │   └── ServiceContext.tsx# Cung cấp quyền truy cập các Service logic xuyên suốt ứng dụng
    ├── core/                 # Tầng xử lý Logic nghiệp vụ cốt lõi (Business Logic Services)
    │   ├── AuthService.ts    # Nghiệp vụ tài khoản (Đăng nhập, Đăng ký, Lưu trữ LocalStorage)
    │   ├── OrderService.ts   # Nghiệp vụ xử lý hợp đồng đặt cọc/thuê váy, trạng thái đơn hàng
    │   └── ProductService.ts # Nghiệp vụ lưu dữ liệu sản phẩm, số lượng tồn kho và khuyến mãi
    ├── lib/                  # Thư viện tiện ích dùng chung
    │   └── utils.ts          # Hàm tiện ích cn() ghép nối các class Tailwind thông minh
    └── pages/                # Các trang hiển thị chính của ứng dụng
        ├── AboutPage.tsx     # Trang Giới thiệu về thương hiệu, cam kết dịch vụ và quy trình bảo quản
        ├── LoginPage.tsx     # Trang Đăng nhập & Đăng ký tài khoản với hiệu ứng chuyển trang mượt mà
        └── ProfilePage.tsx   # Quản lý cá nhân của khách hàng (Xem lịch sử đặt dịch vụ, hóa đơn điện tử)
```

---

## 🔍 Chức Năng Chi Tiết Từng File (File-by-File Description)

### 1. Các File Cấu Hình Tại Thư Mục Gốc (Root Configuration)

- **`index.html`**:
  - _Chức năng_: Bộ khung HTML chuẩn. Đã được tích hợp cơ chế chống lỗi ghi đè thuộc tính `window.fetch` (tránh lỗi xung đột môi trường nhúng của iFrame và thư viện bên ngoài), đảm bảo ứng dụng vận hành trơn tru ở mọi môi trường.
- **`metadata.json`**:
  - _Chức năng_: Khai báo thông tin độc quyền cho nền tảng AI Studio (gồm tên, mô tả ngắn của sản phẩm và các quyền truy cập tài nguyên phần cứng như camera, microphone nếu cần).
- **`package.json`**:
  - _Chức năng_: Danh sách các thư viện mã nguồn gốc (React, Tailwind CSS, Lucide Icons, Framer Motion...) và định dạng các câu lệnh vận hành dự án như khởi chạy server local (`npm run dev`) hay kiểm tra lỗi mã nguồn (`npm run lint`).
- **`vite.config.ts`**:
  - _Chức năng_: Định vị cổng kết nối (Port 3000) bắt buộc của máy chủ ảo và cung cấp bộ dịch mã biên dịch nhanh để ứng dụng đạt hiệu suất tối đa.

### 2. Thư Mục Mã Nguồn Core (`/src/core`)

_Đây là bộ não vận hành dữ liệu. Hệ thống vận hành theo nguyên lý **Offline-First**, tự động đồng bộ hóa và lưu trữ dữ liệu an toàn vào bộ nhớ trình duyệt (`localStorage`) của khách hàng._

- **`mockData.ts`**:
  - _Chức năng_: Chứa dữ liệu khởi tạo mặc định phong phú cho ứng dụng:
    - Bộ sưu tập trang phục (luxury evening gowns) tinh tế với hình ảnh thực tế, mô tả chi tiết, giá thuê theo ngày, số lượng trong kho và số lượt đã thuê.
    - Tài khoản Admin và khách hàng trải nghiệm để sử dụng ngay mà không cần qua quy trình đăng ký phức tạp.
    - Lịch sử đơn hàng và các danh mục phân loại thời trang thịnh hành.
- **`types.ts`**:
  - _Chức năng_: Định nghĩa chặt chẽ các kiểu dữ liệu cốt lõi (TypeScript Interfaces) gồm: `Product`, `Order`, `User`, `Category`. Giúp triệt tiêu các lỗi vận hành liên quan đến sai lệch kiểu dữ liệu hoặc thiếu thuộc tính trong phần mềm.
- **`AuthService.ts`**:
  - _Chức năng_: Điểm kiểm tra thông tin tài khoản đăng nhập, xử lý tạo mới hồ sơ người dùng, phân quyền truy cập (Admin vs Khách hàng) và quản trị bộ nhớ đệm thông tin cá nhân.
- **`ProductService.ts`**:
  - _Chức năng_: Cung cấp luồng API giả lập để thêm mới sản phẩm thời trang, chỉnh sửa giá thuê, tăng giảm tồn kho thực tế, bộ lọc váy theo phân loại danh mục, và cập nhật tính năng Flash Sale nổi bật.
- **`OrderService.ts`**:
  - _Chức năng_: Xử lý tạo hợp đồng đặt cọc giữ chỗ, tính lũy kế chi phí, và thay đổi trạng thái đơn hàng (Chờ xử lý $\rightarrow$ Chuẩn bị đồ $\rightarrow$ Giao shipper $\rightarrow$ Đã nhận/Đang thuê $\rightarrow$ Hủy đơn). Phát ra sự kiện hệ thống `siha_orders_updated` giúp tức thời cập nhật giao diện ở các trang khác nhau mà không cần load lại trang.

### 3. Thư Mục Quản Lý Trạng Thái (`/src/contexts`)

- **`AuthContext.tsx`**:
  - _Chức năng_: Lưu trữ và chia sẻ vị trí/vai trò của người dùng hiện tại ở mọi màn hình. Cho phép Admin truy cập trang Quản trị hoặc Khách hàng quản lý lịch trình thuê đồ cá nhân.
- **`CartContext.tsx`**:
  - _Chức năng_: Quản lý danh mục giỏ hàng thuê đồ tiện dụng (Thêm giảm số lượng váy, xóa lượt chọn, cập nhật ngày nhận - ngày trả váy thuê và tự động ước tính giá cọc bắt buộc).
- **`LanguageContext.tsx`**:
  - _Chức năng_: Chứa kho từ điển dịch song ngữ (Tiếng Anh/Tiếng Việt). Cung cấp hàm dịch nhanh `t('key')` trực tuyến, cho phép chuyển trạng thái toàn bộ cửa hàng sang giao diện tiếng Anh hoặc tiếng Việt chỉ qua 1 click.
- **`ServiceContext.tsx`**:
  - _Chức năng_: Đóng gói các dịch vụ dữ liệu (`Auth`, `Product`, `Order` Services) thành một khối chia sẻ liền mạch, tăng tính mô-đun hóa cho mã nguồn.

### 4. Giao Diện Hiển Thị & Trang Trực Quan (`/src/pages` & `/src/components`)

- **`StoreFront.tsx`**:
  - _Chức năng_: Gian hàng trung tâm của cửa hàng váy cưới và váy dạ hội.
    - Sử dụng lưới Bento sang trọng hiển thị sản phẩm, gắn thẻ Flash Sale sinh động.
    - Trình tìm kiếm thông minh kết hợp bảng chọn lọc khoảng giá chi tiết.
    - Giao diện hộp thoại mở rộng (Modal) xem chi tiết váy, thư viện đánh giá, chọn size, và đặt lịch thuê đồ ngay tức thì.
- **`AdminDashboard.tsx`**:
  - _Chức năng_: Bảng điều khiển Quản trị viên đỉnh cao:
    - **Thống kê tổng quan**: Doanh số tích lũy, số đơn thuê đang chạy, biểu đồ hiệu quả quay vòng kho.
    - **Quản lý đơn hàng**: Nút dropdown trạng thái cách tân cực đẹp bằng thẻ Badge sinh động. Người quản trị có thể trực tiếp đổi trạng thái của đơn hàng từ đây.
    - **Kho hàng dồi dào**: Quản lý chỉnh sửa thông tin váy, giá cọc, tình trạng tồn kho thực tế.
    - **Quản lý phân mục thời trang**: Bản thiết kế cập nhật mới nhất cho phép Admin tùy chỉnh danh mục bằng Grid chọn Icon minh họa đẹp mắt nhanh gọn.
- **`ProfilePage.tsx`**:
  - _Chức năng_: Hồ sơ lưu trữ của khách hàng. Gồm danh sách các đơn hàng thuê váy lịch sử và hiện tại, hóa đơn dịch vụ chi tiết có thể in ra trực tiếp chỉ bằng một phím bấm (`In hóa đơn`).
- **`LoginPage.tsx`**:
  - _Chức năng_: Màn hình đón tiếp khách đăng nhập hoặc đăng ký mới với tính năng chuyển đổi Form chuyển động (Framer Motion) tinh xảo, bắt mắt.
- **`AboutPage.tsx`**:
  - _Chức năng_: Trang thông tin kể câu chuyện thương hiệu thời trang cao cấp, chính sách đảm bảo váy tinh tươm, giặt là tiêu chuẩn, quy chuẩn bảo mật cọc nhằm xây dựng niềm tin vững chắc đối với quý cô đặt váy lần đầu.
- **`ChatWidget.tsx`**:
  - _Chức năng_: Widget bọt bóng hội thoại ở góc phải màn hình, thiết lập sẵn những câu hỏi trợ giúp tức thì thường gặp giúp nâng tầm chất lượng chăm sóc khách hàng tự động.
- **`LanguageToggle.tsx`**:
  - _Chức năng_: Nút chuyển đổi nhanh ngôn ngữ VI-EN dạng tròn sang trọng được cố định ở các điểm điều hướng thiết yếu.

### 5. Tiện Ích Trực Quan & Định Dạng Toàn Diện

- **`App.tsx`**:
  - _Chức năng_: Thanh menu tối giản hàng đầu phản hồi kích thước màn hình linh hoạt. Bố trí thanh điều hướng liên kết mượt mà 3 phân vùng chính: Cửa hàng (StoreFront), Giới thiệu (About) và Cá nhân (Profile) hoặc Quản trị (Admin) tương ứng với tài khoản đăng nhập của bạn.
- **`index.css`**:
  - _Chức năng_: Tải font chữ trực tuyến, khai cấu trúc Tailwind CSS v4, tối ưu hóa giao diện hiển thị mượt và thiết kế Responsive cho các trải nghiệm trên máy tính để bàn cũng như thiết bị di động.
