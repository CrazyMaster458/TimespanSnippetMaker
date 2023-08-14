import { Outlet, useSearchParams } from "react-router-dom";

export const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const showActiveUsers = searchParams.get("filter") === "active";

  return (
    <div>
      <div>
        <h1>User 1</h1>
        <h1>User 2</h1>
        <h1>User 3</h1>
      </div>
      <Outlet />
      <div>
        <button onClick={() => setSearchParams({ filter: "active" })}>
          Active Users
        </button>
        <button onClick={() => setSearchParams({})}>Reset filter</button>
      </div>
      {showActiveUsers ? <h2>Showing Active Users</h2> : <h2>How ALl Users</h2>}
    </div>
  );
};
