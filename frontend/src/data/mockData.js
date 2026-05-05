import { ShoppingBag, LayoutDashboard, Users, UtensilsCrossed, ShoppingCart, Clock, CheckCircle2, TrendingUp } from "lucide-react";

import MenuImg1 from "../assets/menu-1.png";
import MenuImg2 from "../assets/menu-2.png";
import MenuImg3 from "../assets/menu-3.png";
import MenuImg4 from "../assets/menu-4.png";
import MenuImg5 from "../assets/menu-5.png";
import MenuImg6 from "../assets/menu-6.png";

export const statusStyles = {
  Delivered: "bg-status-delivered/30 text-content-paragraph",
  Preparing: "bg-status-preparing/30 text-content-paragraph",
  Pending: "bg-status-shipping/30 text-content-paragraph",
  Cancelled: "bg-status-cancelled/30 text-content-paragraph",
};

export const DashboardCards = [
  {
    icon: <ShoppingBag size={20} />,
    title: "Total Orders",
    number: 1284,
    rate: 12,
    color: "orange",
    date: "Today, 12:45 PM"

  },
  {
    icon: <LayoutDashboard size={20} />,
    title: "Total Revenue",
    number: 42590.2,
    rate: 8,
    color: "purple"
  },
  {
    icon: <Users size={20} />,
    title: "Total Users",
    number: 8432,
    rate: 5,
    color: "blue"
  },
  {
    icon: <UtensilsCrossed size={20} />,
    title: "Total Products",
    number: 42,
    color: "gray"
  }
]

export const OrdersData = [
  {
    id: "#QB-0001",
    customer: "User1",
    amount: 18.5,
    status: "Preparing",
    date: "Today, 12:45 PM"
  },
  {
    id: "#QB-0002",
    customer: "User2",
    amount: 22.0,
    status: "Pending",
    date: "Today, 12:45 PM"
  },
  {
    id: "#QB-0003",
    customer: "User3",
    amount: 14.0,
    status: "Delivered",
    date: "Today, 12:45 PM"

  },
  {
    id: "#QB-0004",
    customer: "User4",
    amount: 19.5,
    status: "Cancelled",
    date: "Today, 12:45 PM"
  },
];

export const OrdersCards = [
  {
    icon: < ShoppingCart />,
    title: "Total Orders",
    value: "1,284",
    color: "text-blue-500 bg-blue-50"
  },
  {
    icon: <Clock />,
    title: "Pending",
    value: "24",
    color: "text-orange-500 bg-orange-50"
  },
  {
    icon: <CheckCircle2 />,
    title: "Delivered",
    value: "1,142",
    color: "text-green-500 bg-green-50"
  },
  {
    icon: <TrendingUp />,
    title: "Revenue",
    value: "$ 42.4k",
    color: "text-purple-500 bg-purple-50"
  }
];

export const MenuData = [
  {
    id: 1,
    name: "Truffle Umami Burger",
    category: "Burgers",
    description: "Juicy beef patty with truffle aioli and caramelized onions",
    price: 18.5,
    prepTime: 12,
    image: MenuImg1
  },
  {
    id: 2,
    name: "Margherita D.O.P.",
    category: "Pizza",
    description: "Juicy beef patty with truffle aioli and caramelized onions",
    price: 22.0,
    prepTime: 20,
    image: MenuImg2

  },
  {
    id: 3,
    name: "Signature Caesar",
    category: "Salads",
    description: "Juicy beef patty with truffle aioli and caramelized onions",
    price: 14.0,
    prepTime: 15,
    image: MenuImg3
  },
  {
    id: 4,
    name: "Smoked Carbonara",
    category: "Pasta",
    description: "Juicy beef patty with truffle aioli and caramelized onions",
    price: 19.5,
    prepTime: 17,
    image: MenuImg4
  },
];

export const orderItems = [
  {
    id: 1,
    name: "Signature Cheeseburger",
    quantity: 2,
    price: 25.00,
    img: MenuImg1
  },
  {
    id: 2,
    name: "Harvest Grain Bowl",
    quantity: 1,
    price: 15.00,
    img: MenuImg2
  },
  {
    id: 3,
    name: "Glazed Artisan Donut",
    quantity: 3,
    price: 10.50,
    img: MenuImg3
  }
];

export const cartItems = [
  {
    id: 1,
    name: 'Classic Burger',
    price: 12.99,
    quantity: 1,
    image: MenuImg1
  },
  {
    id: 2,
    name: 'French Fries',
    price: 4.99,
    quantity: 2,
    image: MenuImg2
  }
]

export const orderedItems = [
  {
    id: 1,
    name: "The Kinetic Prime Burger",
    qty: 2,
    status: "CONFIRMED",
    img: MenuImg1
  },
  {
    id: 2,
    name: "The Kinetic Prime Burger",
    qty: 1,
    status: "CONFIRMED",
    img: MenuImg2
  },
  {
    id: 3,
    name: "The Kinetic Prime Burger",
    qty: 3,
    status: "CONFIRMED",
    img: MenuImg3
  },
];


export const UserData = [
  {
    id: 1,
    avatar: "avatar_url",
    name: "Admin",
    email: "admin@quickbite.com",
    role: "Admin",
  },
  {
    id: 2,
    avatar: "avatar_url",
    name: "User1",
    email: "user1@quickbite.com",
    role: "User",
  },
  {
    id: 3,
    avatar: "avatar_url",
    name: "User2",
    email: "user2@quickbite.com",
    role: "User",
  },
  {
    id: 4,
    avatar: "avatar_url",
    name: "User3",
    email: "user3@quickbite.com",
    role: "User",
  },
  {
    id: 5,
    avatar: "avatar_url",
    name: "User4",
    email: "user4@quickbite.com",
    role: "User",
  },
];

export const TheadTabels = {
  DashboardOrders: ["Order ID", "Customer", "Amount", "Status"],
  Orders: ["Order ID", "Customer", "Amount", "Status", "Date", "Actions"],
  Users: ["User Name", "Email Address", "Role", "Actions"],
  Menu: ["Product Image", "Product Name", "Category", "Price", "Prep Time", "Actions"],
};


export const MenuCategories = ["All", "Burgers", "Pizza", "Salads", "Sushi", "Beverages"];

export const MenuProducts = [
  {
    id: 1,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg1,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  },
  {
    id: 2,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg2,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  },
  {
    id: 3,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg3,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  },
  {
    id: 4,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg4,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  },
  {
    id: 5,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg5,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  },
  {
    id: 6,
    name: "Classic Burger",
    price: 12.99,
    image: MenuImg6,
    description: "A classic burger with fresh ingredients and a delicious sauce.",
    category: "Burgers",
    quantity: 100,
    prepareTime: 15
  }
]

export const OrderTrackingData = [
  {
    id: "#123456",
    date: "2023-10-26",
    items: 3,
    total: "$45.00",
    status: "Delivered",
    statusColor: "text-green-600 bg-green-50",
    estTime: "--",
    action: "View Details"
  },
  {
    id: "#123457",
    date: "2023-10-27",
    items: 2,
    total: "$30.00",
    status: "In Transit",
    statusColor: "text-orange-600 bg-orange-50",
    estTime: "15 min",
    action: "Track"
  },
  {
    id: "#123458",
    date: "2023-10-28",
    items: 4,
    total: "$60.00",
    status: "Pending",
    statusColor: "text-gray-600 bg-gray-50",
    estTime: "30 min",
    action: "Cancel"
  }
];