<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  const res = await login({
    email: email.value,
    password: password.value,
  })

  auth.login(res.access_token)
  router.push('/dashboard')
}

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            v-model="email"
            placeholder="seu@email.com"
          />
        </div>

        <div class="space-y-2">
          <Label for="password">Senha</Label>
          <Input
            id="password"
            type="password"
            v-model="password"
            placeholder="••••••••"
          />
        </div>

        <Alert v-if="error" variant="destructive">
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <Button
          class="w-full"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
