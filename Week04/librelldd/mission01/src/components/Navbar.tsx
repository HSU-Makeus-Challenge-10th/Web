import { NavLink } from 'react-router-dom'; 

const LIMS = [
    { to: '/', label: '홈'},
    { to: '/movies/popular', label: '인기 영화'},
    { to: '/movies/now_playing', label: '상영 중'},
    { to: '/movies/top_rated', label: '평점 높은'}, 
    
];

export const Navbar = () => {
    return (
        <div className='flex gap-5 p-5'>
            
            {LIMS.map(({to, label}) => ( 
                <NavLink
                    key={to}
                    to={to}
                    
                    className={({ isActive }) => 
                        isActive ? ' text-purple-600 font-bold' : 'text-purple-100'
                    }
                >
                    {label}
                </NavLink>
            ))}
        </div>
    );
};