# 1. CẤU TRÚC THƯ MỤC

- Thư mục app (chỉ để khai báo router chính và layout), không được thêm component hoặc file nào khác
- Các component dùng chung cho cả dự án phải được viết trong thư mục **_components_**
- Khai báo các biến const, enum vào trong thư mục **_constants_**
- Khai báo các type interface vào trong thư mục **_types_**
- Các hooks hỗ trợ phải viết trong thư mục **_hooks_**
- Thư mục layouts dùng để tạo các layouts dùng chung (layout header footer, layout authen...)
- Khai báo các function hỗ trợ, biến đổi, convert... trong thư mục **_utils_**
- Các phần coding chính của các page nằm trong thư mục **_sections_**
- Các components được tách ra từ luồng coding chính thì thư mục components phải được nằm trong chính thư mục gốc, không nằm cùng cấp với index (vd: login/components/header.tsx)

# 2. LƯU Ý KHI CÀI ĐẶT VÀ SỬ DỤNG THƯ VIỆN

- Kiểm tra tính tương thích, cộng đồng sử dụng, được update liên tục hay không trước khi install
- Kiểm tra dung lượng thư viện có quá lớn không thì tìm thư viện khác tương tự nhưng nhẹ hơn
- Tuyệt đối không cài thư viện lớn mà chỉ dùng 1 2 thứ nhỏ trong đó (vd: install thư viện reactIcon nhưng chỉ dùng 1 2 icon trong đó)
- Import theo subpath/deep import nếu có thể để tối ưu tree shacking _(vd: import { Button } from "antd" => import Button from "antd/es/button")_
- Trong vscode nên cài import cost để đo lường thư viện import, sử dụng bundle-analyzer (nextjs) để kiểm tra, nếu nghi ngờ thư viện chiếm tài nguyên cao bất thường

> **Nghiêm cấm import \* ở mọi nơi**

# 3. QUY TRÌNH ĐẶT TÊN VARIABLE, FOLDER

- Tên thư mục phải là kebab-case (vd: forgot-password, login...)
- Tên functions, biến phải camelCase là (vd: openState, updateEmail, loginFunc...)
- Tên functions phải camelCase là (vd: updateEmail, loginFunc...)
- Tên component phải PascalCase là (vd: PopupDeleteComponent, HeaderComponent, LoginPage...)
- Tên biến const phải PascalCase+snake_case và là biến enum là (vd: enum DATA_TABLE = [])

> **Các biến, function phải đặt tên có ý nghĩa, phù hợp ngữ cảnh. Không được đặt bừa bãi (vd: const a, let ex...)**  
> **Các biến boolean phải là is[name] has[name] (vd: const hasName, isActions...)**

# 4. QUY TRÌNH CODING, COMMIT

- File code tối đa <= 300 dòng, dài hơn phải tách componets
- Các import, biến không sử dụng phải được xóa hết
- Tuyệt đối không để lại console log
- **Tất cả biến, functions, params, props... đều phải có type đi kèm**
- Các chỗ nào lặp code phải viết hàm hoặc component dùng chung
- Khuyến khích viết comment ngắn bằng tiếng anh cho các functions
- Không khuyến khích dùng else, nếu có thể dùng if + return để dễ đọc hiểu
- Không dùng if else lồng nhau
- FC sử dụng arrow functions, các function tính toán độc lập thì dùng function declaration
- Mỗi function chỉ được phục vụ cho 1 chức năng duy nhất
