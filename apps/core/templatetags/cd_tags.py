from django import template
from sekizai.templatetags.sekizai_tags import SekizaiTag
import sekizai.helpers
from classytags.core import Options
from classytags.arguments import Argument, Flag
from classytags.parser import Parser

register = template.Library()


class PrependtoblockParser(Parser):
    def parse_blocks(self):
        name = self.kwargs['name'].var.token
        self.blocks['nodelist'] = self.parser.parse(
            ('endprependtoblock', 'endprependtoblock %s' % name)
        )
        self.parser.delete_first_token()


@register.tag
class Prependtoblock(SekizaiTag):
    name = 'prependtoblock'

    options = Options(
        Argument('name'),
        Flag('strip', default=False, true_values=['strip']),
        parser_class=PrependtoblockParser,
    )

    def render_tag(self, context, name, strip, nodelist):
        rendered_contents = nodelist.render(context)
        if strip:
            rendered_contents = rendered_contents.strip()
        varname = sekizai.helpers.get_varname()
        context[varname][name].insert(0, rendered_contents)
        return ""
