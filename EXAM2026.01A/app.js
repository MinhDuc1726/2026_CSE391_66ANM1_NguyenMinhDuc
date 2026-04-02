// $(function() {}) = viết tắt của $(document).ready()
// Nghĩa là: đợi HTML load xong rồi mới chạy JS
$(function () {
  // Lấy thẻ <dialog> bằng JS thuần (vì jQuery không hỗ trợ showModal)
  const dialog = document.getElementById("popup");

  // Lấy dữ liệu từ localStorage (dạng string)
  let dataString = localStorage.getItem("students");

  // Nếu có dữ liệu → parse JSON
  // Nếu không → gán mảng rỗng []
  let students = dataString ? JSON.parse(dataString) : [];

  // Nếu localStorage chưa có dữ liệu
  if (students.length === 0) {
    // Gán dữ liệu mẫu (mockData)
    students = [...mockData];

    // Lưu lại vào localStorage
    localStorage.setItem("students", JSON.stringify(students));
  }

  // ========================
  // HÀM RENDER TABLE
  // ========================
  function renderTable() {
    // Lấy keyword từ input search
    let keyword = $("#search").val().toLowerCase();

    // Biến chứa HTML
    let htmlContent = "";

    // Duyệt toàn bộ danh sách sinh viên
    students.forEach(function (student, index) {
      // Kiểm tra tên có chứa keyword không
      let matchName = student.name.toLowerCase().includes(keyword);

      // Kiểm tra email có chứa keyword không
      let matchEmail = student.email.toLowerCase().includes(keyword);

      // Nếu match 1 trong 2 (tên hoặc email)
      if (matchName || matchEmail) {
        // Tạo HTML cho từng dòng
        htmlContent += `
          <tr>
            <td>${student.name}</td>
            <td>${student.speaker}</td>
            <td>${student.email}</td>
            <td>${student.date}</td>
            <td>${student.Location}</td>
      
          </tr>
        `;
      }
    });

    // Nếu không có dữ liệu nào khớp
    if (htmlContent === "") {
      // Hiển thị thông báo
      htmlContent = `
        <tr>
          <td colspan="4" style="text-align:center; padding:15px;">
            Không có dữ liệu
          </td>
        </tr>
      `;
    }

    // Đổ HTML vào bảng
    $("#studentTable").html(htmlContent);
  }

  // ========================
  // EVENT: SEARCH
  // ========================
  // Khi gõ input → render lại bảng
  $("#search").on("input", renderTable);

  // ========================
  // EVENT: THÊM SINH VIÊN
  // ========================
  $("#btnAdd").on("click", function () {
    // Reset form về ban đầu
    $("#studentForm")[0].reset();

    // Xóa lỗi
    $(".error").text("");

    // Reset editIndex (rỗng = thêm mới)
    $("#editIndex").val("");

    // Đổi title
    $("#formTitle").text("Add new conference");

    // Mở popup
    dialog.showModal();
  });

  // ========================
  // EVENT: ĐÓNG POPUP
  // ========================
  $("#btnClose").on("click", function () {
    dialog.close();
  });

  
  

  // ========================
  // EVENT: SUBMIT FORM
  // ========================
  $("#studentForm").on("submit", function (e) {
    // Ngăn reload trang
    e.preventDefault();

    // Xóa lỗi cũ
    $(".error").text("");

    let isValid = true;

    // Lấy dữ liệu từ form
    let name = $("#name").val().trim();
    let Speaker= $("#Speaker").val().trim();
    let email = $("#email").val().trim();
    let Date= $("#Date").val().trim();
    let Location= $("#Date").val().trim();

    // ===== VALIDATE NAME =====
    if (name === "") {
      $("#errName").text("Vui lòng nhập họ tên");
      isValid = false;
    } else if (name.length > 200) {
      $("#errName").text("Họ tên tối đa 200 ký tự");
      isValid = false;
    }

    // ===== VALIDATE Speaker =====
   if (Speaker === "") {
      $("#errName").text("Vui lòng nhập họ tên");
      isValid = false;
    } else if (name.length > 30) {
      $("#errName").text("Họ tên tối đa 30 ký tự");
      isValid = false;
    }

    // ===== VALIDATE EMAIL =====
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      $("#errEmail").text("Email không đúng định dạng");
      isValid = false;
    }

    if (Date === "") {
      $("#errDate").text("Vui lòng nhập ngày tháng");
      isValid = false;
    } 
    if (Location === "") {
      $("#errDate").text("Vui lòng nhập vị trí");
      isValid = false;
    } 
    
    

    // ===== NẾU HỢP LỆ =====
    if (isValid) {
      // Lấy index (nếu có)
      let editIndex = $("#editIndex").val();

      // Tạo object mới
      let newStudent = {
        name: name,
        email: email,
        phone: phone,
        address: address,
      };

      // Nếu không có index → thêm mới
      if (editIndex === "") {
        students.push(newStudent);
      } else {
        // Ngược lại → sửa
        students[editIndex] = newStudent;
      }

      // Lưu localStorage
      localStorage.setItem("students", JSON.stringify(students));

      // Render lại
      renderTable();

      // Đóng popup
      dialog.close();
    }
  });

  // ========================
  // CHẠY LẦN ĐẦU
  // ========================
  renderTable();
});
