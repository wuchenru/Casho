from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Transaction
from django.db.models import Sum
from datetime import datetime, timedelta


@shared_task
def send_monthly_report(user_id):
    """发送月度报告邮件"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        
        # 获取本月交易统计
        now = datetime.now()
        start_date = now.replace(day=1).date()
        end_date = now.date()
        
        transactions = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        )
        
        income_total = transactions.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        expense_total = transactions.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        balance = income_total - expense_total
        
        # 发送邮件
        subject = f'{now.strftime("%Y年%m月")} 财务报告'
        message = f"""
        亲爱的 {user.username}，
        
        以下是您 {now.strftime("%Y年%m月")} 的财务报告：
        
        总收入: ¥{income_total:.2f}
        总支出: ¥{expense_total:.2f}
        余额: ¥{balance:.2f}
        
        感谢使用 Casho！
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return f"月度报告已发送给 {user.email}"
        
    except User.DoesNotExist:
        return f"用户 {user_id} 不存在"


@shared_task
def cleanup_old_transactions():
    """清理旧交易记录（保留2年）"""
    cutoff_date = datetime.now().date() - timedelta(days=730)
    deleted_count = Transaction.objects.filter(date__lt=cutoff_date).delete()[0]
    return f"删除了 {deleted_count} 条旧交易记录"


@shared_task
def generate_weekly_summary():
    """生成周报统计"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    now = datetime.now()
    start_date = now.date() - timedelta(days=7)
    end_date = now.date()
    
    summary = []
    
    for user in User.objects.all():
        transactions = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        )
        
        income_total = transactions.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        expense_total = transactions.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        summary.append({
            'user_id': user.id,
            'username': user.username,
            'income': float(income_total),
            'expense': float(expense_total),
            'balance': float(income_total - expense_total)
        })
    
    return summary 