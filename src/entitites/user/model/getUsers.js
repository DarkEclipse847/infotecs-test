import { fetchJson } from "@/shared/api/users";

export async function getUsers() {
  const rawData = await fetchJson("https://dummyjson.com/users");
  let data = await rawData.users;
  // No middlename in JSON??
  const polishedUserData = data.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    age: item.age,
    gender: item.gender,
    phone: item.phone,
    email: item.email,
    country: item.address.country,
    city: item.address.city,
    address: item.address.address,
    image: item.image,
  }));

  return polishedUserData;
}
