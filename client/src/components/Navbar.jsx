// client/src/components/Navbar.jsx
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    ShoppingCartIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { classNames } from '../utils/tailwind';

const navigation = [
    { name: 'Homepage', href: '/' },
    { name: 'Products', href: '/products' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.user.loggedIn);
    const user = useSelector((state) => state.user.user);
    const cartCount = useSelector((state) => state.cart.count);

    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    const isActive = (href) => {
        return location.pathname === href;
    };

    const handleAuthClick = () => {
        if (loggedIn) {
            dispatch(logout());
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    const displayName = user?.name || (isAdmin ? 'Admin' : (isUser ? 'User' : 'Guest'));

    return (
        <Disclosure
            as="nav"
            className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-lg"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-pink-50 hover:bg-white/10 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-pink-300">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="block size-6 group-data-open:hidden"
                            />
                            <XMarkIcon
                                aria-hidden="true"
                                className="hidden size-6 group-data-open:block"
                            />
                        </DisclosureButton>
                    </div>

                    {/* Logo + desktop navigation */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=f9a8d4&shade=500"
                                className="h-8 w-auto drop-shadow"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        aria-current={isActive(item.href) ? 'page' : undefined}
                                        className={classNames(
                                            isActive(item.href)
                                                ? 'bg-purple-700/80 text-white shadow-sm'
                                                : 'text-pink-50/90 hover:bg-white/10 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Cart / Orders / Profile */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">

                        {/* My Cart - doar pentru user normal */}
                        {loggedIn && isUser && (
                            <Link
                                to="/cart"
                                className={classNames(
                                    isActive('/cart')
                                        ? 'bg-purple-700/80 text-white'
                                        : 'bg-white/10 text-pink-50 hover:bg-white/20',
                                    'relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                )}
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                <span>My Cart</span>
                                {cartCount > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* My Orders - pentru user */}
                        {loggedIn && isUser && (
                            <Link
                                to="/orders"
                                className={classNames(
                                    isActive('/orders')
                                        ? 'bg-purple-700/80 text-white'
                                        : 'bg-white/10 text-pink-50 hover:bg-white/20',
                                    'relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                )}
                            >
                                <ClipboardDocumentListIcon className="h-5 w-5" />
                                <span>My Orders</span>
                            </Link>
                        )}

                        {/* All Orders - pentru admin */}
                        {loggedIn && isAdmin && (
                            <Link
                                to="/admin/orders"
                                className={classNames(
                                    isActive('/admin/orders')
                                        ? 'bg-purple-700/80 text-white'
                                        : 'bg-white/10 text-pink-50 hover:bg-white/20',
                                    'relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                )}
                            >
                                <ClipboardDocumentListIcon className="h-5 w-5" />
                                <span>All Orders</span>
                            </Link>
                        )}

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-1">
                            <MenuButton className="relative flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-white/10 hover:bg-white/20 text-pink-50 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300">
                                <UserCircleIcon className="size-8 rounded-full bg-pink-600/80 outline -outline-offset-1 outline-white/40 text-pink-100" />
                                <span>{displayName}</span>
                            </MenuButton>

                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <div className="px-4 pb-2 text-xs text-gray-500">
                                    Logged in as
                                    <div className="font-semibold text-gray-800">
                                        {displayName}
                                    </div>
                                </div>
                                <MenuItem>
                                    <button
                                        disabled
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-default"
                                    >
                                        Your profile
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        disabled
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-default"
                                    >
                                        Settings
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleAuthClick}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-rose-100 data-focus:outline-hidden hover:bg-rose-50"
                                    >
                                        {loggedIn ? 'Sign out' : 'Sign in'}
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            <DisclosurePanel className="sm:hidden bg-pink-600/95 backdrop-blur">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as={Link}
                            to={item.href}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                            className={classNames(
                                isActive(item.href)
                                    ? 'bg-purple-700/80 text-white'
                                    : 'text-pink-50 hover:bg-white/10 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}

                    {/* My Cart & My Orders in meniul mobil pentru user */}
                    {loggedIn && isUser && (
                        <>
                            <DisclosureButton
                                as={Link}
                                to="/cart"
                                className={classNames(
                                    isActive('/cart')
                                        ? 'bg-purple-700/80 text-white'
                                        : 'text-pink-50 hover:bg-white/10 hover:text-white',
                                    'flex items-center justify-between rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    <span>My Cart</span>
                                </span>
                                {cartCount > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </DisclosureButton>

                            <DisclosureButton
                                as={Link}
                                to="/orders"
                                className={classNames(
                                    isActive('/orders')
                                        ? 'bg-purple-700/80 text-white'
                                        : 'text-pink-50 hover:bg-white/10 hover:text-white',
                                    'flex items-center rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                                <span>My Orders</span>
                            </DisclosureButton>
                        </>
                    )}

                    {/* All Orders in meniul mobil pentru admin */}
                    {loggedIn && isAdmin && (
                        <DisclosureButton
                            as={Link}
                            to="/admin/orders"
                            className={classNames(
                                isActive('/admin/orders')
                                    ? 'bg-purple-700/80 text-white'
                                    : 'text-pink-50 hover:bg-white/10 hover:text-white',
                                'flex items-center rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                            <span>All Orders</span>
                        </DisclosureButton>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
