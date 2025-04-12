export default class Account {
  constructor(name, password, phone, email, photo, address, birthDate, cin, permis) {
    this.name = name;
    this.password = password;
    this.phone = phone;
    this.email = email;
    this.photo = photo;
    this.address = address;
    this.birthDate = birthDate;
    this.cin = cin;
    this.permis = permis;
  }

  updatePassword(newPassword) {
    if (typeof newPassword === 'string' && newPassword.length > 0) {
      this.password = newPassword;
      return true;
    }
    return false;
  }

  updatePhone(newPhone) {
    if (typeof newPhone === 'string' && newPhone.length > 0) {
      this.phone = newPhone;
      return true;
    }
    return false;
  }

  updatePhoto(newPhoto) {
    if (typeof newPhoto === 'string' && newPhoto.length > 0) {
      this.photo = newPhoto;
      return true;
    }
    return false;
  }

  updateName(newName) {
    if (typeof newName === 'string' && newName.length > 0) {
      this.name = newName;
      return true;
    }
    return false;
  }

  getPassword() {
    return this.password;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPhone() {
    return this.phone;
  }

  getPhoto() {
    return this.photo;
  }
}
