import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function NotFoundPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>404</div>;
  }

  return <div>오류가 발생했습니다.</div>;
}
