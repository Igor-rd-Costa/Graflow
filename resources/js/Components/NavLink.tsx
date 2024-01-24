import { Link, InertiaLinkProps } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-turquoise-500 text-turquoise-500 focus:border-turquoise-200 focus:text-turquoise-200'
                    : 'border-transparent text-black hover:text-turquoise-200 hover:border-turquoise-200 focus:text-turquoise-200 focus:border-turquoise-200') +
                className
            }
        >
            {children}
        </Link>
    );
}
