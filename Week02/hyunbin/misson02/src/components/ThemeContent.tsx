import clsx from "clsx"
import { useTheme } from "../context/ThemeProvider"

export default function ThemeContent() {
    const {theme} = useTheme()
    
    const isLightMode = theme === 'LIGHT'
    return <div className={clsx(
        'p-4 h-dvh', isLightMode ? 'bg-white': 'bg-gray-800')}>
            <h1 className={clsx('text-wxl font-bold', isLightMode ? 'bg-white': 'bg-gray-800')}>
                Theme Content
            </h1>
            <p className={clsx('mt-2', isLightMode ? 'bg-white': 'bg-gray-800')}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                Perspiciatis quibusdam consectetur temporibus, eaque reiciendis nam iste! 
                Tempora molestias, vel quis id in, ea laborum, sapiente magnam beatae quod odit eos!</p>
        </div>
}