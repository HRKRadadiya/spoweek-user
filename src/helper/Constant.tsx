export type Role = "USER" | "ADMIN";

enum Gender {
    male = "MALE",
    female = "FEMALE",
    other = "OTHER",
}

enum UserType {
    Non = "Non",
    Standard = "Standard",
    Basic = "Basic",
    Premium = "Premium"
}

enum Languages {
    en = "en",
    ko = "ko",
}
enum RoleType {
    user = "USER",
    admin = "ADMIN",
}

enum LoginWith {
    Manual = "Manual",
    Kakaotalk = "Kakaotalk",
    Naver = "Naver"
}

enum RelationShip_en {
    daughter = "Daughter",
    son = "Son",
    other = "Other"
}

enum RelationShip_ko {
    daughter = "딸",
    son = "아들",
    other = "직접 입력"
}

enum ServiceDuration_en {
    days = "1 of 3 days",
    week = "1 week",
    month = "1 month"
}

enum ServiceDuration_ko {
    days = "3일",
    week = "1주일",
    month = "1달"
}


enum MemorialHallStatusEnum {
    Public = "Public",
    Private = "Private"
}

enum StatusType {
    AddFriend = "AddFriend",
    Waiting = "Waiting",
    Confirm = "Confirm",
}

export {
    UserType,
    Gender,
    Languages,
    RoleType,
    LoginWith,
    RelationShip_en,
    RelationShip_ko,
    ServiceDuration_en,
    ServiceDuration_ko,
    MemorialHallStatusEnum,
    StatusType
};
