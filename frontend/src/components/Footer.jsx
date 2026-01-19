export default function Footer() {
  return (
    <footer className="glass-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">本项目由</span>
            <a
              href="https://www.aliyun.com/product/esa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              阿里云ESA
            </a>
            <span className="text-sm text-gray-600">提供加速、计算和保护</span>
          </div>

          <div className="flex justify-center">
            <a
              href="https://www.aliyun.com/product/esa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png"
                alt="阿里云ESA"
                className="h-8 opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          <p className="text-xs text-gray-500">
            © 2025 AI圆桌会议 · 让多个AI模型协作讨论，迭代出更优秀的答案
          </p>
        </div>
      </div>
    </footer>
  );
}
