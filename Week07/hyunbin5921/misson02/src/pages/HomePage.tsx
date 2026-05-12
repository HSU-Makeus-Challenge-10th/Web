import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const { data } = useGetLpList({});
  const lpList = data?.data?.data || [];
  return (
    <div>
      {lpList.length === 0 ? (
        <p>현재 표시할 LP가 없습니다.</p>
      ) : (
        lpList.map((lp) => <h1 key={lp.id}>{lp.title}</h1>)
      )}
    </div>
  );
};

export default HomePage;
