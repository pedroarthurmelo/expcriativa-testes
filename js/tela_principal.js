// Scroll efeito no menu (mantido aqui)
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 100) {
            nav.classList.add('nav-black');
        } else {
            nav.classList.remove('nav-black');
        }
    });
    function atualizarMenuUsuario(status) {
        const dropdown = document.querySelector('.dropdown');
        if (status === 'logado') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    function verificarSessao() {
        fetch('../php/verificar_sessao.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'expirado') {
                    alert('Tempo de sessão expirado! Faça login novamente.');
                    window.location.href = '../html/login.html';
                } else {
                    atualizarMenuUsuario(data.status);
                }
            })
            .catch(error => {
                console.error('Erro ao verificar a sessão:', error);
            });
    }

    verificarSessao();
    
    setInterval(verificarSessao, 5000);