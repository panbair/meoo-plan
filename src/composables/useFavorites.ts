import { ref, computed } from 'vue'

// 从 localStorage 加载收藏的组件名列表
const loadFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('cardFavorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 收藏的组件名列表
const favorites = ref<string[]>(loadFavorites())

// 保存收藏到 localStorage
const saveFavorites = () => {
  localStorage.setItem('cardFavorites', JSON.stringify(favorites.value))
}

// 切换收藏状态
const toggleFavorite = (dirName: string) => {
  const index = favorites.value.indexOf(dirName)
  if (index === -1) {
    favorites.value.push(dirName)
  } else {
    favorites.value.splice(index, 1)
  }
  saveFavorites()
}

// 检查组件是否已收藏
const isFavorite = (dirName: string) => favorites.value.includes(dirName)

// 获取所有收藏的组件名
const favoriteComponents = computed(() => favorites.value)

// 导出 composable
export function useFavorites() {
  return {
    favorites,
    favoriteComponents,
    toggleFavorite,
    isFavorite
  }
}
